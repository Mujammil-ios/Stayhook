/**
 * Supabase Edge Function for sending housekeeping reminders
 * 
 * Deploy this function to Supabase Edge Functions:
 * 1. Install Supabase CLI
 * 2. Run: supabase functions deploy housekeepingReminder
 * 
 * To set it up as a scheduled function:
 * supabase functions deploy housekeepingReminder
 * supabase functions schedule housekeepingReminder --cron "0 7 * * *"
 */

// Example metadata for the function
export const version = '1.0.0';

// PostgreSQL types for housekeeping requests
interface HousekeepingRequest {
  id: string;
  property_id: string;
  room_id: string;
  room_number: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requested_at: string;
  due_by: string;
  completed_at: string | null;
  notes: string | null;
  assigned_to: string | null;
}

// Staff notification type
interface StaffNotification {
  staff_id: string;
  email: string;
  phone_number: string | null;
  name: string;
  property_id: string;
  property_name: string;
  requests: HousekeepingRequest[];
}

/**
 * Handles HTTP requests to this function or scheduled execution
 */
Deno.serve(async (req) => {
  try {
    // Create Supabase client using environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check for override parameters in request
    let propertyId = null;
    let checkOverdueOnly = true;
    
    if (req.method === 'POST') {
      const payload = await req.json();
      propertyId = payload.propertyId;
      checkOverdueOnly = payload.checkOverdueOnly !== false;
    }
    
    // Get current time in ISO format
    const now = new Date().toISOString();
    
    // Build the query
    let query = supabase
      .from('housekeeping_requests')
      .select(`
        *,
        room:room_id(number),
        property:property_id(id, name),
        staff:assigned_to(id, email, phone_number, first_name, last_name)
      `)
      .is('completed_at', null);
    
    // Filter by property if specified
    if (propertyId) {
      query = query.eq('property_id', propertyId);
    }
    
    // Filter by overdue status if specified
    if (checkOverdueOnly) {
      query = query.lt('due_by', now);
    }
    
    // Order by priority and due date
    query = query.order('priority', { ascending: false }).order('due_by', { ascending: true });
    
    // Execute the query
    const { data: requests, error } = await query;
    
    if (error) {
      throw new Error(`Database query error: ${error.message}`);
    }
    
    // Process the results
    const staffMap = new Map<string, StaffNotification>();
    
    // Group requests by assigned staff
    for (const request of requests) {
      // Skip if no staff assigned
      if (!request.staff) continue;
      
      const staffId = request.staff.id;
      
      if (!staffMap.has(staffId)) {
        staffMap.set(staffId, {
          staff_id: staffId,
          email: request.staff.email,
          phone_number: request.staff.phone_number,
          name: `${request.staff.first_name} ${request.staff.last_name}`,
          property_id: request.property.id,
          property_name: request.property.name,
          requests: []
        });
      }
      
      // Add the request to the staff's list
      staffMap.get(staffId)?.requests.push({
        ...request,
        room_number: request.room.number
      });
    }
    
    // Send notifications to each staff member
    const notificationResults = await Promise.all(
      Array.from(staffMap.values()).map(staffNotification => 
        sendStaffNotification(staffNotification)
      )
    );
    
    // Return the results
    return new Response(
      JSON.stringify({
        success: true,
        timestamp: now,
        propertyId,
        checkOverdueOnly,
        notificationsCount: notificationResults.length,
        notifications: notificationResults
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});

/**
 * Send notification to a staff member
 */
async function sendStaffNotification(
  notification: StaffNotification
): Promise<{ staffId: string; success: boolean; method: string; error?: string }> {
  try {
    // Try to send email first
    if (notification.email) {
      await sendEmailNotification(notification);
      return { 
        staffId: notification.staff_id, 
        success: true, 
        method: 'email' 
      };
    }
    
    // Fall back to SMS if email not available
    if (notification.phone_number) {
      await sendSmsNotification(notification);
      return { 
        staffId: notification.staff_id, 
        success: true, 
        method: 'sms' 
      };
    }
    
    throw new Error('No contact method available');
  } catch (error) {
    console.error(`Failed to notify staff ${notification.staff_id}:`, error);
    return { 
      staffId: notification.staff_id, 
      success: false, 
      method: 'failed',
      error: error.message 
    };
  }
}

/**
 * Send email notification 
 */
async function sendEmailNotification(notification: StaffNotification): Promise<void> {
  const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');
  const fromEmail = Deno.env.get('FROM_EMAIL');
  
  if (!sendgridApiKey || !fromEmail) {
    throw new Error('Missing SendGrid configuration');
  }
  
  // Format the requests for the email
  const requestsList = notification.requests.map(req => {
    const due = new Date(req.due_by).toLocaleString();
    const priority = req.priority.toUpperCase();
    return `- Room ${req.room_number}: ${priority} priority, due by ${due}${req.notes ? ` (${req.notes})` : ''}`;
  }).join('\n');
  
  // Prepare email data
  const emailData = {
    personalizations: [
      {
        to: [{ email: notification.email, name: notification.name }],
        subject: `Housekeeping Tasks Reminder for ${notification.property_name}`,
        dynamic_template_data: {
          staff_name: notification.name,
          property_name: notification.property_name,
          overdue_count: notification.requests.length,
          tasks: notification.requests.map(req => ({
            room: req.room_number,
            priority: req.priority.toUpperCase(),
            due: new Date(req.due_by).toLocaleString(),
            notes: req.notes || ''
          }))
        }
      }
    ],
    from: { email: fromEmail, name: notification.property_name },
    template_id: Deno.env.get('SENDGRID_HOUSEKEEPING_TEMPLATE_ID'),
    // Fallback plain text content if template not available
    content: [
      {
        type: 'text/plain',
        value: `Hello ${notification.name},\n\nYou have ${notification.requests.length} housekeeping tasks that need attention at ${notification.property_name}:\n\n${requestsList}\n\nPlease complete these tasks as soon as possible.\n\nThank you,\n${notification.property_name} Management`
      }
    ]
  };
  
  // Send the email using SendGrid API
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${sendgridApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`SendGrid API error: ${errorData.errors?.[0]?.message || response.statusText}`);
  }
}

/**
 * Send SMS notification
 */
async function sendSmsNotification(notification: StaffNotification): Promise<void> {
  const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');
  
  if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
    throw new Error('Missing Twilio configuration');
  }
  
  // Format the message
  const message = `${notification.name}, you have ${notification.requests.length} housekeeping tasks at ${notification.property_name} that need attention. Please check the app for details.`;
  
  // Send the SMS using Twilio API
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      From: twilioPhoneNumber,
      To: notification.phone_number!,
      Body: message
    }).toString()
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Twilio API error: ${errorData.message || response.statusText}`);
  }
}

/**
 * Create Supabase client (simplified for Edge Function)
 */
function createClient(supabaseUrl: string, supabaseKey: string) {
  return {
    from: (table: string) => ({
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          is: (column: string, value: any) => ({
            lt: (column: string, value: any) => ({
              order: (column: string, options: { ascending: boolean }) => ({
                order: (column: string, options: { ascending: boolean }) => ({
                  // Final method that would execute the query
                  // This is a simplified mock for the example
                  then: (callback: (result: any) => void) => {
                    // In a real function, this would be the actual Supabase query
                    callback({ data: [], error: null });
                  }
                })
              })
            })
          })
        })
      })
    })
  };
}