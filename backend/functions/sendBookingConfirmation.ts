/**
 * Supabase Edge Function for sending booking confirmation emails
 * 
 * Deploy this function to Supabase Edge Functions:
 * 1. Install Supabase CLI
 * 2. Run: supabase functions deploy sendBookingConfirmation
 */

// Example metadata for the function
export const version = '1.0.0';

// Define the request payload type
interface BookingEmailPayload {
  bookingId: string;
  guestEmail: string;
  guestName: string;
  propertyName: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  totalAmount: number;
  currency: string;
  confirmationCode: string;
}

// Define the response type
interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Handles HTTP requests to this function
 */
Deno.serve(async (req) => {
  // Check if request method is POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  try {
    // Parse request body
    const payload = await req.json() as BookingEmailPayload;
    
    // Validate required fields
    if (!payload.bookingId || !payload.guestEmail || !payload.confirmationCode) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Get environment variables
    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');
    const fromEmail = Deno.env.get('FROM_EMAIL');
    
    if (!sendgridApiKey || !fromEmail) {
      console.error('Missing required environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Send email via SendGrid API
    const result = await sendEmail(
      sendgridApiKey,
      fromEmail,
      payload
    );
    
    if (!result.success) {
      return new Response(
        JSON.stringify({ error: result.error }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        messageId: result.messageId,
        bookingId: payload.bookingId
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
 * Send email via SendGrid API
 */
async function sendEmail(
  apiKey: string,
  fromEmail: string,
  payload: BookingEmailPayload
): Promise<EmailResponse> {
  try {
    const checkInDate = new Date(payload.checkInDate).toLocaleDateString();
    const checkOutDate = new Date(payload.checkOutDate).toLocaleDateString();
    
    // Prepare email data
    const emailData = {
      personalizations: [
        {
          to: [{ email: payload.guestEmail, name: payload.guestName }],
          subject: `Booking Confirmation: ${payload.confirmationCode}`,
          dynamic_template_data: {
            guest_name: payload.guestName,
            property_name: payload.propertyName,
            confirmation_code: payload.confirmationCode,
            check_in_date: checkInDate,
            check_out_date: checkOutDate,
            room_type: payload.roomType,
            total_amount: payload.totalAmount.toFixed(2),
            currency: payload.currency,
            booking_id: payload.bookingId
          }
        }
      ],
      from: { email: fromEmail, name: payload.propertyName },
      reply_to: { email: fromEmail, name: `${payload.propertyName} Support` },
      template_id: Deno.env.get('SENDGRID_BOOKING_TEMPLATE_ID')
    };
    
    // Send the email using SendGrid API
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('SendGrid API error:', errorData);
      return {
        success: false,
        error: `SendGrid API error: ${errorData.errors?.[0]?.message || response.statusText}`
      };
    }
    
    // Extract message ID from response headers
    const messageId = response.headers.get('X-Message-ID');
    
    return {
      success: true,
      messageId
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: `Email sending error: ${error.message}`
    };
  }
}

// HTML template for email (fallback if template ID not provided)
const EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; border-bottom: 1px solid #eee; }
    .content { padding: 20px 0; }
    .booking-details { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px 0; border-top: 1px solid #eee; font-size: 12px; color: #777; }
    .button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Confirmation</h1>
    </div>
    <div class="content">
      <p>Dear {{guest_name}},</p>
      <p>Thank you for your reservation at {{property_name}}. Your booking has been confirmed!</p>
      
      <div class="booking-details">
        <h3>Booking Details</h3>
        <p><strong>Confirmation Code:</strong> {{confirmation_code}}</p>
        <p><strong>Check-in Date:</strong> {{check_in_date}}</p>
        <p><strong>Check-out Date:</strong> {{check_out_date}}</p>
        <p><strong>Room Type:</strong> {{room_type}}</p>
        <p><strong>Total Amount:</strong> {{currency}} {{total_amount}}</p>
      </div>
      
      <p>If you need to modify or cancel your reservation, please contact us with your confirmation code.</p>
      
      <p>We look forward to welcoming you!</p>
      
      <p>Best regards,<br>
      {{property_name}} Team</p>
    </div>
    <div class="footer">
      <p>This is an automated email. Please do not reply directly to this message.</p>
    </div>
  </div>
</body>
</html>
`;