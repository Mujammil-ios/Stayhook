-- Supabase SQL Migrations: Database Triggers
--
-- This file contains trigger definitions and PL/pgSQL functions 
-- for the hotel management system
--
-- To deploy: Run this in your Supabase SQL editor or via the Supabase CLI
-- with `supabase migration up`

-- FUNCTION: Update or insert into revenues when a billing record is created
CREATE OR REPLACE FUNCTION public.billing_to_revenue()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if a revenue record for this billing already exists
  IF EXISTS (SELECT 1 FROM public.revenues WHERE billing_id = NEW.id) THEN
    -- Update existing revenue record
    UPDATE public.revenues
    SET 
      property_id = NEW.property_id,
      amount = NEW.amount,
      currency = NEW.currency,
      category = NEW.category,
      description = NEW.description,
      status = NEW.status,
      updated_at = NOW()
    WHERE billing_id = NEW.id;
  ELSE
    -- Insert new revenue record
    INSERT INTO public.revenues (
      property_id,
      billing_id,
      amount,
      currency,
      category,
      description,
      status,
      created_at,
      updated_at
    ) VALUES (
      NEW.property_id,
      NEW.id,
      NEW.amount,
      NEW.currency,
      NEW.category,
      NEW.description,
      NEW.status,
      NOW(),
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER: After billing insert, update revenues
DROP TRIGGER IF EXISTS trigger_billing_to_revenue ON public.billings;
CREATE TRIGGER trigger_billing_to_revenue
AFTER INSERT OR UPDATE ON public.billings
FOR EACH ROW
EXECUTE FUNCTION public.billing_to_revenue();

-- FUNCTION: Send email when reservation status changes to 'booked'
CREATE OR REPLACE FUNCTION public.send_booking_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger when status changes to 'booked'
  IF NEW.status = 'booked' AND (OLD.status IS NULL OR OLD.status <> 'booked') THEN
    -- Call the Edge Function to send email
    -- This is a placeholder - in Supabase, we'll use pg_net to call the Edge Function
    PERFORM
      net.http_post(
        url := concat(
          current_setting('app.settings.supabase_url'),
          '/functions/v1/sendBookingConfirmation'
        ),
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', concat('Bearer ', current_setting('app.settings.edge_function_key'))
        ),
        body := jsonb_build_object(
          'bookingId', NEW.id,
          'guestEmail', (SELECT email FROM guests WHERE id = NEW.guest_id),
          'guestName', (
            SELECT concat(first_name, ' ', last_name) 
            FROM guests WHERE id = NEW.guest_id
          ),
          'propertyName', (SELECT name FROM properties WHERE id = NEW.property_id),
          'checkInDate', NEW.check_in_date,
          'checkOutDate', NEW.check_out_date,
          'roomType', (
            SELECT name FROM room_types rt
            JOIN booking_rooms br ON br.room_type_id = rt.id
            WHERE br.booking_id = NEW.id
            LIMIT 1
          ),
          'totalAmount', NEW.total_amount,
          'currency', NEW.currency,
          'confirmationCode', NEW.confirmation_code
        )
      );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER: After reservation status update, send email confirmation
DROP TRIGGER IF EXISTS trigger_send_booking_confirmation ON public.bookings;
CREATE TRIGGER trigger_send_booking_confirmation
AFTER UPDATE OF status ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.send_booking_confirmation();

-- FUNCTION: Automatically assign housekeeping tasks when rooms change status
CREATE OR REPLACE FUNCTION public.auto_assign_housekeeping()
RETURNS TRIGGER AS $$
DECLARE
  v_property_id UUID;
  v_staff_id UUID;
BEGIN
  -- Only trigger when status changes to 'checkout'
  IF NEW.status = 'checkout' AND OLD.status <> 'checkout' THEN
    -- Get property ID for this room
    SELECT property_id INTO v_property_id FROM rooms WHERE id = NEW.id;
    
    -- Find available housekeeping staff for this property
    -- Simple round-robin assignment (could be improved with workload balancing)
    SELECT s.id INTO v_staff_id
    FROM staff s
    JOIN user_properties up ON s.user_id = up.user_id
    WHERE 
      up.property_id = v_property_id AND
      s.role = 'housekeeping' AND
      s.is_active = true
    ORDER BY 
      -- This ensures round-robin by selecting staff with fewest current assignments
      (
        SELECT COUNT(*) 
        FROM housekeeping_requests hr 
        WHERE hr.assigned_to = s.id AND hr.status IN ('pending', 'in_progress')
      ) ASC
    LIMIT 1;
    
    -- Create housekeeping request
    IF v_staff_id IS NOT NULL THEN
      INSERT INTO housekeeping_requests (
        property_id,
        room_id,
        status,
        priority,
        requested_at,
        due_by,
        assigned_to,
        notes
      ) VALUES (
        v_property_id,
        NEW.id,
        'pending',
        'medium',  -- default priority, could be customized
        NOW(),
        NOW() + INTERVAL '3 hours',  -- due within 3 hours
        v_staff_id,
        'Auto-assigned after guest checkout'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER: After room status update, auto-assign housekeeping
DROP TRIGGER IF EXISTS trigger_auto_assign_housekeeping ON public.rooms;
CREATE TRIGGER trigger_auto_assign_housekeeping
AFTER UPDATE OF status ON public.rooms
FOR EACH ROW
EXECUTE FUNCTION public.auto_assign_housekeeping();

-- FUNCTION: Automatically mark housekeeping requests as overdue
CREATE OR REPLACE FUNCTION public.mark_overdue_housekeeping()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE housekeeping_requests
  SET status = 'overdue'
  WHERE 
    status = 'pending' AND
    due_by < NOW();
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Event trigger to run hourly and check for overdue housekeeping tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule(
  'mark_overdue_housekeeping',
  '0 * * * *',  -- Every hour
  $$
    SELECT public.mark_overdue_housekeeping();
  $$
);

-- FUNCTION: Update room availability when a booking is created/updated
CREATE OR REPLACE FUNCTION public.update_room_availability()
RETURNS TRIGGER AS $$
BEGIN
  -- For new bookings with 'confirmed' or 'booked' status
  IF (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.status <> NEW.status)) 
     AND NEW.status IN ('confirmed', 'booked') THEN
    
    -- Update room status to 'reserved'
    UPDATE rooms r
    SET status = 'reserved'
    FROM booking_rooms br
    WHERE 
      br.booking_id = NEW.id AND
      br.room_id = r.id;
      
  -- For cancelled bookings
  ELSIF TG_OP = 'UPDATE' AND NEW.status = 'cancelled' AND OLD.status <> 'cancelled' THEN
    
    -- Update room status back to 'available'
    UPDATE rooms r
    SET status = 'available'
    FROM booking_rooms br
    WHERE 
      br.booking_id = NEW.id AND
      br.room_id = r.id;
  
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER: After booking status change, update room availability
DROP TRIGGER IF EXISTS trigger_update_room_availability ON public.bookings;
CREATE TRIGGER trigger_update_room_availability
AFTER INSERT OR UPDATE OF status ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_room_availability();