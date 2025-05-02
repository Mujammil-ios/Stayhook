import { SupabaseClient, RealtimeChannel, createClient } from '@supabase/supabase-js';
import { SupabaseError } from '../supabaseBase';

/**
 * Type of realtime subscription events
 */
export type SubscriptionEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

/**
 * Callback for realtime events
 */
export type RealtimeCallback<T = any> = (payload: {
  eventType: SubscriptionEvent;
  new: T | null;
  old: T | null;
}) => void;

/**
 * Channel config for managing subscriptions
 */
interface ChannelConfig {
  name: string;
  channel: RealtimeChannel;
  tables: string[];
}

/**
 * Service for handling realtime subscriptions with Supabase
 */
export class RealtimeService {
  private client: SupabaseClient;
  private channels: ChannelConfig[] = [];

  /**
   * Creates a new RealtimeService instance
   */
  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new SupabaseError('Supabase URL or key not found in environment variables');
    }

    this.client = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Subscribe to changes on a table
   * 
   * @param table - The table name to subscribe to
   * @param callback - Function called when events occur
   * @param event - The specific event type to listen for
   * @param filter - Optional filter string (e.g., 'id=eq.123')
   * @returns A subscription ID that can be used to unsubscribe
   */
  subscribe<T = any>(
    table: string,
    callback: RealtimeCallback<T>,
    event: SubscriptionEvent = '*',
    filter?: string
  ): string {
    // Generate a unique channel name
    const channelName = `${table}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    
    // Set up the channel
    let channel = this.client.channel(channelName);
    
    // Add the subscription
    channel = channel.on(
      'postgres_changes',
      {
        event: event === '*' ? undefined : event,
        schema: 'public',
        table,
        filter
      },
      (payload) => {
        callback({
          eventType: payload.eventType as SubscriptionEvent,
          new: payload.new as T || null,
          old: payload.old as T || null
        });
      }
    );
    
    // Subscribe to the channel
    channel.subscribe((status) => {
      if (status !== 'SUBSCRIBED') {
        console.error(`Failed to subscribe to ${table}: ${status}`);
      }
    });
    
    // Store the channel configuration
    this.channels.push({
      name: channelName,
      channel,
      tables: [table]
    });
    
    return channelName;
  }

  /**
   * Subscribe to changes on multiple tables
   * 
   * @param tables - Array of table configurations
   * @returns A subscription ID that can be used to unsubscribe
   */
  subscribeToMultiple(
    tables: Array<{
      table: string;
      callback: RealtimeCallback;
      event?: SubscriptionEvent;
      filter?: string;
    }>
  ): string {
    // Generate a unique channel name
    const channelName = `multi_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    
    // Set up the channel
    let channel = this.client.channel(channelName);
    
    // Add all subscriptions
    tables.forEach(({ table, callback, event = '*', filter }) => {
      channel = channel.on(
        'postgres_changes',
        {
          event: event === '*' ? undefined : event,
          schema: 'public',
          table,
          filter
        },
        (payload) => {
          callback({
            eventType: payload.eventType as SubscriptionEvent,
            new: payload.new || null,
            old: payload.old || null
          });
        }
      );
    });
    
    // Subscribe to the channel
    channel.subscribe((status) => {
      if (status !== 'SUBSCRIBED') {
        console.error(`Failed to subscribe to multiple tables: ${status}`);
      }
    });
    
    // Store the channel configuration
    this.channels.push({
      name: channelName,
      channel,
      tables: tables.map(t => t.table)
    });
    
    return channelName;
  }

  /**
   * Example: Subscribe to reservation changes
   * 
   * @param propertyId - Optional property ID to filter by
   * @param callback - Function called when events occur
   * @returns A subscription ID that can be used to unsubscribe
   */
  subscribeToReservations<T = any>(
    callback: RealtimeCallback<T>,
    propertyId?: string
  ): string {
    const filter = propertyId ? `property_id=eq.${propertyId}` : undefined;
    return this.subscribe<T>('reservations', callback, '*', filter);
  }

  /**
   * Example: Subscribe to room status changes
   * 
   * @param propertyId - Optional property ID to filter by
   * @param callback - Function called when events occur
   * @returns A subscription ID that can be used to unsubscribe
   */
  subscribeToRoomStatusChanges<T = any>(
    callback: RealtimeCallback<T>,
    propertyId?: string
  ): string {
    const filter = propertyId ? `property_id=eq.${propertyId}` : undefined;
    return this.subscribe<T>('rooms', callback, 'UPDATE', filter);
  }

  /**
   * Example: Create a consolidated dashboard subscription
   * 
   * @param propertyId - The property ID to filter by
   * @param callbacks - Object with callbacks for different tables
   * @returns A subscription ID that can be used to unsubscribe
   */
  subscribeToDashboard(
    propertyId: string,
    callbacks: {
      onReservationChange?: RealtimeCallback;
      onRoomStatusChange?: RealtimeCallback;
      onHousekeepingRequest?: RealtimeCallback;
      onCustomerActivity?: RealtimeCallback;
    }
  ): string {
    const subscriptions = [];
    
    if (callbacks.onReservationChange) {
      subscriptions.push({
        table: 'reservations',
        callback: callbacks.onReservationChange,
        filter: `property_id=eq.${propertyId}`
      });
    }
    
    if (callbacks.onRoomStatusChange) {
      subscriptions.push({
        table: 'rooms',
        callback: callbacks.onRoomStatusChange,
        event: 'UPDATE' as SubscriptionEvent,
        filter: `property_id=eq.${propertyId}`
      });
    }
    
    if (callbacks.onHousekeepingRequest) {
      subscriptions.push({
        table: 'housekeeping_requests',
        callback: callbacks.onHousekeepingRequest,
        filter: `property_id=eq.${propertyId}`
      });
    }
    
    if (callbacks.onCustomerActivity) {
      subscriptions.push({
        table: 'customer_activity_log',
        callback: callbacks.onCustomerActivity,
        filter: `property_id=eq.${propertyId}`
      });
    }
    
    return this.subscribeToMultiple(subscriptions);
  }

  /**
   * Unsubscribe from a channel
   * 
   * @param channelName - The subscription ID returned from subscribe
   * @returns True if successfully unsubscribed
   */
  unsubscribe(channelName: string): boolean {
    const channelIndex = this.channels.findIndex(c => c.name === channelName);
    
    if (channelIndex === -1) {
      return false;
    }
    
    const { channel } = this.channels[channelIndex];
    
    this.client.removeChannel(channel);
    this.channels.splice(channelIndex, 1);
    
    return true;
  }

  /**
   * Unsubscribe from all channels
   */
  unsubscribeAll(): void {
    this.channels.forEach(({ channel }) => {
      this.client.removeChannel(channel);
    });
    
    this.channels = [];
  }
}

export default new RealtimeService();