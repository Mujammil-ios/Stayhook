/**
 * Policy Templates
 * 
 * Common policy templates for hotels and hospitality businesses
 */

import { Policy } from '../types/index';

export const policyTemplates: Policy[] = [
  // Cancellation Policy
  {
    name: "Cancellation Policy",
    description: "Standard cancellation and refund terms for hotel reservations",
    isActive: true,
    rules: [
      {
        title: "Free Cancellation Window",
        description: "Reservations may be cancelled free of charge up to 48 hours before the scheduled check-in date and time."
      },
      {
        title: "Late Cancellation Fee",
        description: "Cancellations made within 48 hours of the scheduled check-in will incur a charge equal to the first night's stay."
      },
      {
        title: "No-Show Policy",
        description: "Guests who fail to arrive on their scheduled check-in date without prior notification will be charged for the first night and the remainder of the reservation will be cancelled."
      },
      {
        title: "Early Departure",
        description: "No refunds will be provided for early check-out or unused nights. The full reserved stay will be charged."
      },
      {
        title: "Group Booking Cancellations",
        description: "Group bookings of 5 rooms or more have a 7-day cancellation policy and require a 50% deposit at the time of booking."
      }
    ]
  },
  
  // Check-In/Check-Out Policy
  {
    name: "Check-In/Check-Out Policy",
    description: "Standard arrival and departure procedures for guests",
    isActive: true,
    rules: [
      {
        title: "Check-In Time",
        description: "Standard check-in time is 3:00 PM. Early check-in may be available based on room availability and may incur an additional fee."
      },
      {
        title: "Check-Out Time",
        description: "Standard check-out time is 11:00 AM. Late check-out until 2:00 PM may be available upon request for an additional fee, subject to availability."
      },
      {
        title: "ID Requirement",
        description: "All guests must present a valid government-issued photo ID at check-in. International guests must provide a passport."
      },
      {
        title: "Payment Requirements",
        description: "A valid credit card is required at check-in for incidentals, even if the room is prepaid. A hold may be placed on the card."
      },
      {
        title: "Minimum Age Requirement",
        description: "Guests must be at least 18 years of age to check in without a guardian and 21 years of age to reserve a room."
      }
    ]
  },
  
  // Pet Policy
  {
    name: "Pet Policy",
    description: "Rules and guidelines for guests traveling with pets",
    isActive: true,
    rules: [
      {
        title: "Pet-Friendly Rooms",
        description: "Pets are allowed only in designated pet-friendly rooms. Maximum of 2 pets per room."
      },
      {
        title: "Pet Fee",
        description: "A non-refundable pet fee of $25 per pet per night will be charged to cover additional cleaning and maintenance."
      },
      {
        title: "Pet Weight Limit",
        description: "We accept pets weighing 50 pounds or less. Service animals are exempt from weight restrictions."
      },
      {
        title: "Pet Behavior Guidelines",
        description: "Pets must be leashed in all public areas. Owners are responsible for cleaning up after their pets on hotel grounds."
      },
      {
        title: "Noise Policy",
        description: "Excessive noise from pets that disturbs other guests may result in the pet and owner being asked to leave without refund."
      },
      {
        title: "Damages",
        description: "Pet owners are financially responsible for any damages caused by their pet to hotel property or furnishings."
      }
    ]
  },
  
  // Smoking Policy
  {
    name: "Smoking Policy",
    description: "Regulations regarding smoking and vaping on hotel premises",
    isActive: true,
    rules: [
      {
        title: "Non-Smoking Property",
        description: "Our property is 100% non-smoking, including all guest rooms, restaurants, lobby areas, and public spaces."
      },
      {
        title: "Definition of Smoking",
        description: "Smoking includes the use of cigarettes, cigars, pipes, e-cigarettes, vape pens, and any other smoking or vaping device."
      },
      {
        title: "Designated Smoking Areas",
        description: "Smoking is permitted only in designated outdoor areas, which are clearly marked and located at least 25 feet from any building entrance."
      },
      {
        title: "Violation Fee",
        description: "A $250 cleaning fee will be charged to guests who smoke in non-smoking areas, including guest rooms."
      },
      {
        title: "Fire Alarm Response",
        description: "Setting off a fire alarm due to smoking in rooms will result in a fee equal to any charges levied by local emergency services."
      }
    ]
  },
  
  // Payment Policy
  {
    name: "Payment Policy",
    description: "Guidelines for payment methods, deposits, and billing",
    isActive: true,
    rules: [
      {
        title: "Accepted Payment Methods",
        description: "We accept Visa, MasterCard, American Express, Discover, and cash. Personal checks are not accepted."
      },
      {
        title: "Reservation Guarantee",
        description: "All reservations must be guaranteed with a valid credit card at the time of booking."
      },
      {
        title: "Security Deposit",
        description: "A security deposit of $100 per stay will be authorized on your credit card upon check-in to cover incidentals."
      },
      {
        title: "Billing",
        description: "Your bill will be available for review 24 hours before checkout. Any discrepancies should be reported immediately to the front desk."
      },
      {
        title: "Currency",
        description: "All rates are quoted and charged in local currency. Currency exchange services are available at the front desk for a fee."
      },
      {
        title: "Tax Exemption",
        description: "Guests requesting tax exemption must present proper documentation at check-in. Post-stay tax adjustments are not available."
      }
    ]
  },
  
  // Child & Extra Person Policy
  {
    name: "Child & Extra Person Policy",
    description: "Guidelines for children and additional guests in rooms",
    isActive: true,
    rules: [
      {
        title: "Maximum Occupancy",
        description: "Maximum room occupancy is strictly enforced according to room type and fire safety regulations."
      },
      {
        title: "Children Policy",
        description: "Children under 12 years old stay free when using existing bedding. Maximum of 2 children per room."
      },
      {
        title: "Infant Policy",
        description: "Cribs are available upon request at no additional charge, subject to availability. Maximum of 1 crib per room."
      },
      {
        title: "Extra Adult Fee",
        description: "Additional adults (13 years and older) will be charged $20 per person per night beyond the standard room occupancy."
      },
      {
        title: "Rollaway Beds",
        description: "Rollaway beds are available in select room types for a fee of $15 per night, subject to availability."
      }
    ]
  },
  
  // Noise & Disturbance Policy
  {
    name: "Noise & Disturbance Policy",
    description: "Guidelines to ensure a peaceful environment for all guests",
    isActive: true,
    rules: [
      {
        title: "Quiet Hours",
        description: "Quiet hours are enforced from 10:00 PM to 7:00 AM. During these hours, guests are expected to keep noise at a minimum."
      },
      {
        title: "Disturbance Reporting",
        description: "Guests experiencing noise disturbances should contact the front desk immediately for assistance."
      },
      {
        title: "Party Policy",
        description: "Parties or gatherings that create excessive noise are not permitted in guest rooms at any time."
      },
      {
        title: "Warning System",
        description: "Guests will receive one warning for noise complaints. Continued disturbances may result in eviction without refund."
      },
      {
        title: "Music & Entertainment",
        description: "Playing of musical instruments, music systems, or TVs at volumes that disturb other guests is prohibited at all times."
      }
    ]
  },
  
  // Internet & Technology Policy
  {
    name: "Internet & Technology Policy",
    description: "Guidelines for using internet and technology services",
    isActive: true,
    rules: [
      {
        title: "Wi-Fi Access",
        description: "Complimentary Wi-Fi is available throughout the property. Access codes will be provided at check-in."
      },
      {
        title: "Bandwidth Usage",
        description: "High-bandwidth activities such as large downloads or streaming may be throttled during peak usage times."
      },
      {
        title: "Prohibited Activities",
        description: "Use of hotel internet services for illegal activities, including copyright infringement or accessing inappropriate content, is strictly prohibited."
      },
      {
        title: "Business Center",
        description: "The business center is available 24/7 for guest use. Printing services are available for a nominal fee."
      },
      {
        title: "Technical Support",
        description: "Technical support for internet connectivity issues is available through the front desk during operating hours."
      }
    ]
  }
];