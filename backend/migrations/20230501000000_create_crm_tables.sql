-- Migration to create Customer Relationship Management tables
-- This adds guest interactions, preferences, loyalty, and marketing consent tables
-- to enhance the hotel management system with comprehensive CRM features

-- Guest Interactions table - stores all communications with guests
CREATE TABLE IF NOT EXISTS public.guest_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
    interaction_type TEXT NOT NULL CHECK (interaction_type IN ('inquiry', 'feedback', 'complaint', 'request', 'followup', 'other')),
    channel TEXT NOT NULL CHECK (channel IN ('email', 'phone', 'in_person', 'web', 'social', 'sms', 'other')),
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved', 'closed', 'pending')),
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    response TEXT,
    response_by UUID REFERENCES public.staff(id) ON DELETE SET NULL,
    response_at TIMESTAMPTZ,
    attachments TEXT[],
    tags TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guest_interactions_property_id ON public.guest_interactions(property_id);
CREATE INDEX IF NOT EXISTS idx_guest_interactions_guest_id ON public.guest_interactions(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_interactions_staff_id ON public.guest_interactions(staff_id);
CREATE INDEX IF NOT EXISTS idx_guest_interactions_status ON public.guest_interactions(status);
CREATE INDEX IF NOT EXISTS idx_guest_interactions_created_at ON public.guest_interactions(created_at);

-- Guest Preferences table - stores guest preferences for personalized service
CREATE TABLE IF NOT EXISTS public.guest_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('room', 'food', 'amenities', 'service', 'communication', 'other')),
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (guest_id, category, name)
);

CREATE INDEX IF NOT EXISTS idx_guest_preferences_guest_id ON public.guest_preferences(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_preferences_category ON public.guest_preferences(category);

-- Loyalty Programs table - defines available loyalty programs
CREATE TABLE IF NOT EXISTS public.loyalty_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    point_value NUMERIC(10, 2),
    currency TEXT,
    tiers JSONB,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Guest Loyalty table - stores guests' loyalty program memberships
CREATE TABLE IF NOT EXISTS public.guest_loyalty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.loyalty_programs(id) ON DELETE CASCADE,
    membership_number TEXT,
    tier TEXT,
    points INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'expired')),
    expiry_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (guest_id, program_id)
);

CREATE INDEX IF NOT EXISTS idx_guest_loyalty_guest_id ON public.guest_loyalty(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_loyalty_program_id ON public.guest_loyalty(program_id);
CREATE INDEX IF NOT EXISTS idx_guest_loyalty_status ON public.guest_loyalty(status);

-- Loyalty Transactions table - tracks changes to loyalty points
CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loyalty_id UUID NOT NULL REFERENCES public.guest_loyalty(id) ON DELETE CASCADE,
    points_change INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_loyalty_id ON public.loyalty_transactions(loyalty_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_created_at ON public.loyalty_transactions(created_at);

-- Guest Marketing Consents table - tracks marketing permission preferences
CREATE TABLE IF NOT EXISTS public.guest_marketing_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
    channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'phone', 'mail', 'all')),
    consented BOOLEAN NOT NULL,
    purpose TEXT NOT NULL CHECK (purpose IN ('promotions', 'newsletters', 'surveys', 'service_updates', 'all')),
    consent_date TIMESTAMPTZ NOT NULL,
    expiry_date TIMESTAMPTZ,
    source TEXT NOT NULL,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (guest_id, channel, purpose)
);

CREATE INDEX IF NOT EXISTS idx_guest_marketing_consents_guest_id ON public.guest_marketing_consents(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_marketing_consents_channel ON public.guest_marketing_consents(channel);
CREATE INDEX IF NOT EXISTS idx_guest_marketing_consents_consented ON public.guest_marketing_consents(consented);

-- Guest Segments table - defines guest segments for targeted marketing
CREATE TABLE IF NOT EXISTS public.guest_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    criteria JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Guest Segment Memberships table - maps guests to segments
CREATE TABLE IF NOT EXISTS public.guest_segment_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
    segment_id UUID NOT NULL REFERENCES public.guest_segments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (guest_id, segment_id)
);

CREATE INDEX IF NOT EXISTS idx_guest_segment_memberships_guest_id ON public.guest_segment_memberships(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_segment_memberships_segment_id ON public.guest_segment_memberships(segment_id);

-- Guest Interaction Statistics function - calculates stats for a guest
CREATE OR REPLACE FUNCTION public.get_guest_interaction_stats(p_guest_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_total INTEGER;
    v_open INTEGER;
    v_resolved INTEGER;
    v_by_type JSONB;
    v_by_channel JSONB;
    v_response_time NUMERIC;
    v_last_interaction TIMESTAMPTZ;
BEGIN
    -- Total interactions
    SELECT COUNT(*) INTO v_total 
    FROM public.guest_interactions 
    WHERE guest_id = p_guest_id;
    
    -- Open interactions
    SELECT COUNT(*) INTO v_open 
    FROM public.guest_interactions 
    WHERE guest_id = p_guest_id AND status IN ('open', 'in_progress', 'pending');
    
    -- Resolved interactions
    SELECT COUNT(*) INTO v_resolved 
    FROM public.guest_interactions 
    WHERE guest_id = p_guest_id AND status = 'resolved';
    
    -- Interactions by type
    SELECT jsonb_object_agg(interaction_type, count) INTO v_by_type
    FROM (
        SELECT interaction_type, COUNT(*) as count
        FROM public.guest_interactions
        WHERE guest_id = p_guest_id
        GROUP BY interaction_type
    ) t;
    
    -- Interactions by channel
    SELECT jsonb_object_agg(channel, count) INTO v_by_channel
    FROM (
        SELECT channel, COUNT(*) as count
        FROM public.guest_interactions
        WHERE guest_id = p_guest_id
        GROUP BY channel
    ) t;
    
    -- Average response time (in hours)
    SELECT AVG(EXTRACT(EPOCH FROM (response_at - created_at)) / 3600) INTO v_response_time
    FROM public.guest_interactions
    WHERE guest_id = p_guest_id AND response_at IS NOT NULL;
    
    -- Last interaction date
    SELECT MAX(created_at) INTO v_last_interaction
    FROM public.guest_interactions
    WHERE guest_id = p_guest_id;
    
    RETURN jsonb_build_object(
        'totalInteractions', COALESCE(v_total, 0),
        'openInteractions', COALESCE(v_open, 0),
        'resolvedInteractions', COALESCE(v_resolved, 0),
        'byType', COALESCE(v_by_type, '{}'::jsonb),
        'byChannel', COALESCE(v_by_channel, '{}'::jsonb),
        'responseTime', COALESCE(v_response_time, 0),
        'lastInteraction', v_last_interaction
    );
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security on all CRM tables
ALTER TABLE public.guest_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_loyalty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_marketing_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_segment_memberships ENABLE ROW LEVEL SECURITY;

-- Guest Interactions RLS policies
CREATE POLICY "Staff can view guest interactions for their properties" ON public.guest_interactions
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_properties up
        WHERE up.user_id = auth.uid() AND up.property_id = property_id
    )
);

CREATE POLICY "Staff can insert guest interactions for their properties" ON public.guest_interactions
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_properties up
        WHERE up.user_id = auth.uid() AND up.property_id = property_id
    )
);

CREATE POLICY "Staff can update guest interactions for their properties" ON public.guest_interactions
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.user_properties up
        WHERE up.user_id = auth.uid() AND up.property_id = property_id
    )
);

-- Guest Preferences RLS policies
CREATE POLICY "Staff can view guest preferences" ON public.guest_preferences
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.bookings b
        JOIN public.user_properties up ON b.property_id = up.property_id
        WHERE b.guest_id = guest_preferences.guest_id
        AND up.user_id = auth.uid()
    )
);

CREATE POLICY "Staff can manage guest preferences" ON public.guest_preferences
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.bookings b
        JOIN public.user_properties up ON b.property_id = up.property_id
        WHERE b.guest_id = guest_preferences.guest_id
        AND up.user_id = auth.uid()
    )
);

-- More RLS policies would be added for other CRM tables

-- Triggers for automatic updates
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update timestamp triggers to all CRM tables
CREATE TRIGGER update_guest_interactions_timestamp
BEFORE UPDATE ON public.guest_interactions
FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_guest_preferences_timestamp
BEFORE UPDATE ON public.guest_preferences
FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_loyalty_programs_timestamp
BEFORE UPDATE ON public.loyalty_programs
FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_guest_loyalty_timestamp
BEFORE UPDATE ON public.guest_loyalty
FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_guest_marketing_consents_timestamp
BEFORE UPDATE ON public.guest_marketing_consents
FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_guest_segments_timestamp
BEFORE UPDATE ON public.guest_segments
FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();