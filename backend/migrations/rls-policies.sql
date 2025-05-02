-- Supabase Row Level Security Policies
--
-- This file contains RLS policies for the hotel management system
-- These policies control access to data based on the authenticated user's role
--
-- To deploy: Run this in your Supabase SQL editor or via the Supabase CLI with
-- `supabase migration up`

-- Enable RLS on all tables
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_legals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.housekeeping_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create helper functions for RLS
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
DECLARE
  v_role TEXT;
BEGIN
  -- Get the role from the JWT claim
  v_role := current_setting('request.jwt.claims', TRUE)::json->>'role';
  
  -- Default to 'guest' if no role found
  RETURN COALESCE(v_role, 'guest');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_property_staff(property_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
  v_found BOOLEAN;
BEGIN
  -- Get the current user ID from the JWT
  v_user_id := (current_setting('request.jwt.claims', TRUE)::json->>'sub')::UUID;
  
  -- Check if user is assigned to this property
  SELECT EXISTS (
    SELECT 1 FROM public.user_properties
    WHERE user_id = v_user_id AND property_id = property_id
  ) INTO v_found;
  
  RETURN v_found;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_property_owner(property_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
  v_found BOOLEAN;
BEGIN
  -- Get the current user ID from the JWT
  v_user_id := (current_setting('request.jwt.claims', TRUE)::json->>'sub')::UUID;
  
  -- Check if user is the owner of this property
  SELECT EXISTS (
    SELECT 1 FROM public.properties
    WHERE owner_id = v_user_id AND id = property_id
  ) INTO v_found;
  
  RETURN v_found;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy: Everyone can view active properties
CREATE POLICY "Anyone can view active properties" ON public.properties 
FOR SELECT
USING (status = 'active');

-- Policy: Property owners can view their own properties regardless of status
CREATE POLICY "Owners can view their own properties" ON public.properties 
FOR SELECT
USING (owner_id = auth.uid());

-- Policy: Property owners can update their own properties
CREATE POLICY "Owners can update their properties" ON public.properties 
FOR UPDATE
USING (owner_id = auth.uid());

-- Policy: Property owners can insert new properties
CREATE POLICY "Owners can insert properties" ON public.properties 
FOR INSERT
WITH CHECK (owner_id = auth.uid());

-- Policy: Superadmins can do anything
CREATE POLICY "Superadmins can do anything with properties" ON public.properties 
FOR ALL
USING (get_user_role() = 'superadmin');

-- Policy: Staff can view properties they are assigned to
CREATE POLICY "Staff can view assigned properties" ON public.properties 
FOR SELECT
USING (is_property_staff(id));

-- Policy: Property owners can manage rooms for their properties
CREATE POLICY "Owners can manage rooms" ON public.rooms 
FOR ALL
USING (is_property_owner(property_id));

-- Policy: Staff can view and update rooms for properties they are assigned to
CREATE POLICY "Staff can view and update rooms" ON public.rooms 
FOR SELECT
USING (is_property_staff(property_id));

CREATE POLICY "Staff can update rooms" ON public.rooms 
FOR UPDATE
USING (is_property_staff(property_id));

-- Policy: Property owners can manage bookings for their properties
CREATE POLICY "Owners can manage bookings" ON public.bookings 
FOR ALL
USING (is_property_owner(property_id));

-- Policy: Staff can view and update bookings for properties they are assigned to
CREATE POLICY "Staff can view bookings" ON public.bookings 
FOR SELECT
USING (is_property_staff(property_id));

CREATE POLICY "Staff can update bookings" ON public.bookings 
FOR UPDATE
USING (is_property_staff(property_id));

CREATE POLICY "Staff can insert bookings" ON public.bookings 
FOR INSERT
WITH CHECK (is_property_staff(property_id));

-- Policy: Guests can view their own bookings
CREATE POLICY "Guests can view their own bookings" ON public.bookings 
FOR SELECT
USING (guest_id = auth.uid());

-- Policy: Housekeeping staff can view and update their assigned tasks
CREATE POLICY "Staff can view assigned housekeeping tasks" ON public.housekeeping_requests 
FOR SELECT
USING (assigned_to = auth.uid() OR is_property_staff(property_id));

CREATE POLICY "Staff can update assigned housekeeping tasks" ON public.housekeeping_requests 
FOR UPDATE
USING (assigned_to = auth.uid() OR is_property_staff(property_id));

-- Policy: Property owners can manage all housekeeping tasks
CREATE POLICY "Owners can manage housekeeping tasks" ON public.housekeeping_requests 
FOR ALL
USING (is_property_owner(property_id));

-- Policy: Staff can only view guests at properties they are assigned to
CREATE POLICY "Staff can view guests" ON public.guests 
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.guest_id = guests.id
    AND is_property_staff(b.property_id)
  )
);

-- Policy: Property owners can view all guests who have stayed at their properties
CREATE POLICY "Owners can view guests" ON public.guests 
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.guest_id = guests.id
    AND is_property_owner(b.property_id)
  )
);

-- Policy: Only property owners and superadmins can view financial data
CREATE POLICY "Owners can view financial data" ON public.revenues 
FOR SELECT
USING (is_property_owner(property_id) OR get_user_role() = 'superadmin');

CREATE POLICY "Owners can view billings" ON public.billings 
FOR SELECT
USING (is_property_owner(property_id) OR get_user_role() = 'superadmin');

CREATE POLICY "Owners can view expenses" ON public.expenses 
FOR SELECT
USING (is_property_owner(property_id) OR get_user_role() = 'superadmin');

-- Policy: Property owners can manage their staff
CREATE POLICY "Owners can manage staff" ON public.staff 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_properties up
    WHERE up.user_id = staff.user_id
    AND is_property_owner(up.property_id)
  )
);

-- Grant superadmin permissions to service role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;