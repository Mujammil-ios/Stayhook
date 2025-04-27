import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Status types for the dashboard
type BookingStatus = 
  "new" | 
  "in-house" | 
  "arrivals" | 
  "departures" | 
  "cancellations" | 
  "on-hold" | 
  "no-show" | 
  "magic-link";

// Sample data (would be fetched from API in production)
const bookingStats = {
  "new": 12,
  "in-house": 45,
  "arrivals": 8,
  "departures": 6,
  "cancellations": 3,
  "on-hold": 7,
  "no-show": 2,
  "magic-link": 14
};

const StatusCard: React.FC<{ 
  status: BookingStatus; 
  count: number;
  icon: string;
  onAction?: () => void;
  hasAction?: boolean;
  actionIcon?: string;
  actionLabel?: string;
}> = ({
  status,
  count,
  icon,
  onAction,
  hasAction = false,
  actionIcon = "ri-more-line",
  actionLabel = "Action"
}) => {
  // Get the appropriate styling for each card type
  const getCardStyles = () => {
    switch (status) {
      case "new":
        return {
          bgColor: "bg-blue-50 dark:bg-blue-950",
          iconColor: "text-blue-500 dark:text-blue-400",
          textColor: "text-blue-700 dark:text-blue-300",
          borderColor: "border-blue-200 dark:border-blue-800"
        };
      case "in-house":
        return {
          bgColor: "bg-green-50 dark:bg-green-950",
          iconColor: "text-green-500 dark:text-green-400",
          textColor: "text-green-700 dark:text-green-300",
          borderColor: "border-green-200 dark:border-green-800"
        };
      case "arrivals":
        return {
          bgColor: "bg-purple-50 dark:bg-purple-950",
          iconColor: "text-purple-500 dark:text-purple-400",
          textColor: "text-purple-700 dark:text-purple-300",
          borderColor: "border-purple-200 dark:border-purple-800"
        };
      case "departures":
        return {
          bgColor: "bg-amber-50 dark:bg-amber-950",
          iconColor: "text-amber-500 dark:text-amber-400",
          textColor: "text-amber-700 dark:text-amber-300",
          borderColor: "border-amber-200 dark:border-amber-800"
        };
      case "cancellations":
        return {
          bgColor: "bg-red-50 dark:bg-red-950",
          iconColor: "text-red-500 dark:text-red-400",
          textColor: "text-red-700 dark:text-red-300",
          borderColor: "border-red-200 dark:border-red-800"
        };
      case "on-hold":
        return {
          bgColor: "bg-orange-50 dark:bg-orange-950",
          iconColor: "text-orange-500 dark:text-orange-400",
          textColor: "text-orange-700 dark:text-orange-300",
          borderColor: "border-orange-200 dark:border-orange-800"
        };
      case "no-show":
        return {
          bgColor: "bg-gray-50 dark:bg-gray-900",
          iconColor: "text-gray-500 dark:text-gray-400",
          textColor: "text-gray-700 dark:text-gray-300",
          borderColor: "border-gray-200 dark:border-gray-800"
        };
      case "magic-link":
        return {
          bgColor: "bg-indigo-50 dark:bg-indigo-950",
          iconColor: "text-indigo-500 dark:text-indigo-400",
          textColor: "text-indigo-700 dark:text-indigo-300",
          borderColor: "border-indigo-200 dark:border-indigo-800"
        };
      default:
        return {
          bgColor: "bg-neutral-50 dark:bg-neutral-900",
          iconColor: "text-neutral-500 dark:text-neutral-400",
          textColor: "text-neutral-700 dark:text-neutral-300",
          borderColor: "border-neutral-200 dark:border-neutral-800"
        };
    }
  };

  const styles = getCardStyles();
  
  // Get formatted status label
  const getStatusLabel = () => {
    switch (status) {
      case "new": return "New Bookings";
      case "in-house": return "In-House";
      case "arrivals": return "Arrivals";
      case "departures": return "Departures";
      case "cancellations": return "Cancellations";
      case "on-hold": return "On Hold";
      case "no-show": return "No-Show";
      case "magic-link": return "Magic Link";
      default: return status;
    }
  };

  return (
    <Card className={`border ${styles.borderColor} ${styles.bgColor} shadow-sm relative overflow-hidden`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className={`text-sm font-medium ${styles.textColor}`}>{getStatusLabel()}</span>
            <span className="text-3xl font-bold mt-1">{count}</span>
          </div>
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${styles.bgColor} ${styles.iconColor}`}>
            <i className={`${icon} text-2xl`}></i>
          </div>
        </div>
        
        {hasAction && (
          <Button 
            className="mt-4 w-full"
            size="sm"
            variant="secondary"
            onClick={onAction}
          >
            <i className={`${actionIcon} mr-1`}></i> {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export function ReservationsOverview() {
  const { toast } = useToast();

  // Handler for Magic Link generation
  const handleGenerateMagicLink = () => {
    console.log("ACTION: Generate Magic Link");
    
    // Simulate API call to generate link
    setTimeout(() => {
      // Mock link
      const magicLink = "https://hotel.example.com/booking/magic/abc123xyz";
      
      // Simulate clipboard copy
      navigator.clipboard.writeText(magicLink)
        .then(() => {
          toast({
            title: "Magic Link Generated",
            description: "Link has been copied to your clipboard",
            variant: "default",
          });
        })
        .catch((err) => {
          console.error("Failed to copy magic link:", err);
          toast({
            title: "Magic Link Generated",
            description: `Link: ${magicLink}`,
            variant: "default",
          });
        });
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Reservations Overview</h1>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            console.log("Refreshing reservation stats...");
            toast({
              title: "Data Refreshed",
              description: "Reservation statistics have been updated",
              variant: "default",
            });
          }}
        >
          <i className="ri-refresh-line mr-1"></i> Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          status="new"
          count={bookingStats.new}
          icon="ri-file-text-line"
        />
        
        <StatusCard
          status="in-house"
          count={bookingStats["in-house"]}
          icon="ri-home-5-line"
        />
        
        <StatusCard
          status="arrivals"
          count={bookingStats.arrivals}
          icon="ri-flight-land-line"
        />
        
        <StatusCard
          status="departures"
          count={bookingStats.departures}
          icon="ri-flight-takeoff-line"
        />
        
        <StatusCard
          status="cancellations"
          count={bookingStats.cancellations}
          icon="ri-close-circle-line"
        />
        
        <StatusCard
          status="on-hold"
          count={bookingStats["on-hold"]}
          icon="ri-time-line"
        />
        
        <StatusCard
          status="no-show"
          count={bookingStats["no-show"]}
          icon="ri-user-unfollow-line"
        />
        
        <StatusCard
          status="magic-link"
          count={bookingStats["magic-link"]}
          icon="ri-link-m"
          hasAction={true}
          actionIcon="ri-link-m"
          actionLabel="Generate & Copy Link"
          onAction={handleGenerateMagicLink}
        />
      </div>
      
      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800">
        <div className="flex items-start space-x-3">
          <i className="ri-information-line text-blue-500 mt-1"></i>
          <div>
            <h3 className="text-sm font-medium mb-1">About Magic Links</h3>
            <p className="text-sm text-muted-foreground">
              Magic links are unique URLs that allow guests to directly access their booking information without requiring login credentials. 
              Generate and share these links via email or SMS for a seamless guest experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}