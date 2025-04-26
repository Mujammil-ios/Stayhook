import { Property, Room, Guest, Reservation, Staff, User, Finance } from "@shared/schema";

// Sample property data
export const propertyData: Property = {
  id: 1,
  name: "Grand Hotel & Spa",
  address: "123 Main Street, Cityville, CA 94123",
  description: "A luxurious 5-star hotel located in the heart of the city offering premium amenities and exceptional service.",
  taxInfo: "Tax ID: 123-45-6789",
  geoCoordinates: { latitude: 37.7749, longitude: -122.4194 },
  contactInfo: {
    phone: "+1 (555) 123-4567",
    email: "info@grandhotelspa.com",
    website: "www.grandhotelspa.com"
  },
  amenities: [
    "Swimming Pool",
    "Spa & Wellness Center",
    "Fitness Center",
    "Conference Rooms",
    "Restaurant & Bar",
    "Room Service",
    "Concierge Services",
    "Valet Parking"
  ],
  mediaGallery: [
    { type: "image", url: "lobby.jpg", title: "Elegant Lobby" },
    { type: "image", url: "pool.jpg", title: "Outdoor Pool" },
    { type: "image", url: "restaurant.jpg", title: "Fine Dining" },
    { type: "image", url: "spa.jpg", title: "Spa & Wellness" }
  ]
};

// Room types with their attributes
const roomTypes = {
  standard: {
    baseRate: 99,
    capacity: 2,
    amenities: ["Free Wi-Fi", "TV", "Air Conditioning", "Coffee Maker", "Safe"]
  },
  deluxe: {
    baseRate: 149,
    capacity: 2,
    amenities: ["Free Wi-Fi", "TV", "Air Conditioning", "Coffee Maker", "Safe", "Mini Bar", "Workspace"]
  },
  executive: {
    baseRate: 219,
    capacity: 3,
    amenities: ["Free Wi-Fi", "Smart TV", "Air Conditioning", "Coffee Maker", "Safe", "Mini Bar", "Workspace", "Bathrobe", "Slippers"]
  },
  presidential: {
    baseRate: 499,
    capacity: 4,
    amenities: ["Free Wi-Fi", "Smart TV", "Air Conditioning", "Coffee Maker", "Safe", "Mini Bar", "Workspace", "Bathrobe", "Slippers", "Jacuzzi", "Separate Living Area", "Butler Service"]
  }
};

// Generate room data
export const roomsData: Room[] = [];

// Standard rooms (30 total, floor 1-3)
for (let i = 1; i <= 30; i++) {
  const floor = Math.ceil(i / 10);
  const number = i % 10 === 0 ? 10 : i % 10;
  const roomNumber = `${floor}${number.toString().padStart(2, '0')}`;
  
  roomsData.push({
    id: i,
    propertyId: 1,
    number: roomNumber,
    floor,
    category: "Standard Room",
    capacity: roomTypes.standard.capacity,
    baseRate: roomTypes.standard.baseRate,
    status: Math.random() > 0.15 ? "occupied" : "available",
    amenities: roomTypes.standard.amenities,
    dynamicPricing: {
      weekend: 1.25,
      holiday: 1.5,
      low_season: 0.8
    },
    maintenanceHistory: [
      {
        date: "2025-03-15",
        description: "Regular maintenance check",
        performed_by: "Maintenance Staff",
        resolved: true
      }
    ],
    mediaGallery: [
      { type: "image", url: "standard-room.jpg", title: "Standard Room" }
    ]
  });
}

// Deluxe rooms (24 total, floor 4-5)
for (let i = 1; i <= 24; i++) {
  const floor = Math.floor(i / 12) + 4;
  const number = i % 12 === 0 ? 12 : i % 12;
  const roomNumber = `${floor}${number.toString().padStart(2, '0')}`;
  
  roomsData.push({
    id: i + 30,
    propertyId: 1,
    number: roomNumber,
    floor,
    category: "Deluxe King",
    capacity: roomTypes.deluxe.capacity,
    baseRate: roomTypes.deluxe.baseRate,
    status: Math.random() > 0.25 ? "occupied" : "available",
    amenities: roomTypes.deluxe.amenities,
    dynamicPricing: {
      weekend: 1.3,
      holiday: 1.6,
      low_season: 0.85
    },
    maintenanceHistory: [],
    mediaGallery: [
      { type: "image", url: "deluxe-room.jpg", title: "Deluxe Room" }
    ]
  });
}

// Executive Suites (12 total, floor 6)
for (let i = 1; i <= 12; i++) {
  const roomNumber = `6${i.toString().padStart(2, '0')}`;
  
  roomsData.push({
    id: i + 54,
    propertyId: 1,
    number: roomNumber,
    floor: 6,
    category: "Executive Suite",
    capacity: roomTypes.executive.capacity,
    baseRate: roomTypes.executive.baseRate,
    status: Math.random() > 0.25 ? "occupied" : "available",
    amenities: roomTypes.executive.amenities,
    dynamicPricing: {
      weekend: 1.35,
      holiday: 1.7,
      low_season: 0.9
    },
    maintenanceHistory: [],
    mediaGallery: [
      { type: "image", url: "executive-suite.jpg", title: "Executive Suite" }
    ]
  });
}

// Presidential Suites (4 total, floor 7)
for (let i = 1; i <= 4; i++) {
  const roomNumber = `7${i.toString().padStart(2, '0')}`;
  
  roomsData.push({
    id: i + 66,
    propertyId: 1,
    number: roomNumber,
    floor: 7,
    category: "Presidential Suite",
    capacity: roomTypes.presidential.capacity,
    baseRate: roomTypes.presidential.baseRate,
    status: Math.random() > 0.5 ? "occupied" : "available",
    amenities: roomTypes.presidential.amenities,
    dynamicPricing: {
      weekend: 1.4,
      holiday: 1.8,
      low_season: 0.95
    },
    maintenanceHistory: [],
    mediaGallery: [
      { type: "image", url: "presidential-suite.jpg", title: "Presidential Suite" }
    ]
  });
}

// Set one room to maintenance status
roomsData[5].status = "maintenance";
roomsData[5].maintenanceHistory.push({
  date: "2025-04-22",
  description: "AC not functioning properly",
  performed_by: "Maintenance Team",
  resolved: false
});

// Sample guest data
export const guestsData: Guest[] = [
  {
    id: 1,
    firstName: "Tom",
    lastName: "Cook",
    email: "tom@example.com",
    phone: "+1 (555) 123-4567",
    identificationDoc: "ID12345678",
    personalInfo: {
      dateOfBirth: "1985-06-15",
      nationality: "American",
      address: "456 Oak Street, San Francisco, CA 94101"
    },
    contactDetails: {
      emergencyContact: "Jane Cook",
      emergencyPhone: "+1 (555) 987-6543"
    },
    preferences: {
      roomType: "Executive Suite",
      dietaryRestrictions: "None",
      specialRequests: "High floor with city view"
    },
    stayHistory: [
      {
        reservationId: 1,
        checkIn: "2024-12-10",
        checkOut: "2024-12-15",
        roomNumber: "603",
        totalSpent: 1295.00
      }
    ],
    loyaltyInfo: {
      tier: "Platinum",
      points: 5600,
      memberSince: "2020-03-15"
    }
  },
  {
    id: 2,
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah@example.com",
    phone: "+1 (555) 234-5678",
    identificationDoc: "ID23456789",
    personalInfo: {
      dateOfBirth: "1990-08-22",
      nationality: "Canadian",
      address: "789 Maple Avenue, Vancouver, BC V6B 2V5"
    },
    contactDetails: {
      emergencyContact: "David Johnson",
      emergencyPhone: "+1 (555) 876-5432"
    },
    preferences: {
      roomType: "Deluxe King",
      dietaryRestrictions: "Vegetarian",
      specialRequests: "Quiet room away from elevator"
    },
    stayHistory: [
      {
        reservationId: 2,
        checkIn: "2025-01-05",
        checkOut: "2025-01-08",
        roomNumber: "412",
        totalSpent: 447.00
      }
    ],
    loyaltyInfo: {
      tier: "Gold",
      points: 3450,
      memberSince: "2021-05-20"
    }
  },
  {
    id: 3,
    firstName: "Michael",
    lastName: "Wilson",
    email: "michael@example.com",
    phone: "+1 (555) 345-6789",
    identificationDoc: "ID34567890",
    personalInfo: {
      dateOfBirth: "1978-11-30",
      nationality: "British",
      address: "10 Downing Street, London, UK SW1A 2AA"
    },
    contactDetails: {
      emergencyContact: "Elizabeth Wilson",
      emergencyPhone: "+44 20 7123 4567"
    },
    preferences: {
      roomType: "Standard Room",
      dietaryRestrictions: "Gluten-free",
      specialRequests: "Extra pillows"
    },
    stayHistory: [
      {
        reservationId: 3,
        checkIn: "2025-02-15",
        checkOut: "2025-02-19",
        roomNumber: "118",
        totalSpent: 396.00
      }
    ],
    loyaltyInfo: {
      tier: "Silver",
      points: 1850,
      memberSince: "2022-09-10"
    }
  }
];

// Sample reservations data
export const reservationsData: Reservation[] = [
  {
    id: 1,
    roomId: 58,
    checkInDate: new Date("2025-04-23"),
    checkOutDate: new Date("2025-04-26"),
    status: "confirmed",
    guestIds: [1],
    specialRequests: ["Late check-in", "Airport pickup", "Champagne in room"],
    paymentDetails: {
      method: "Credit Card",
      cardType: "Visa",
      lastFour: "4567",
      totalAmount: 657.00,
      deposit: 219.00,
      isPaid: true
    },
    timeline: {
      created: "2025-03-15T10:30:00Z",
      confirmed: "2025-03-15T10:35:00Z",
      modified: null,
      checkedIn: null,
      checkedOut: null,
      cancelled: null
    },
    linkedBookings: [],
    createdAt: new Date("2025-03-15T10:30:00Z")
  },
  {
    id: 2,
    roomId: 42,
    checkInDate: new Date("2025-04-24"),
    checkOutDate: new Date("2025-04-26"),
    status: "pending",
    guestIds: [2],
    specialRequests: ["Early check-in if possible"],
    paymentDetails: {
      method: "Credit Card",
      cardType: "Mastercard",
      lastFour: "8901",
      totalAmount: 298.00,
      deposit: 0,
      isPaid: false
    },
    timeline: {
      created: "2025-04-18T15:45:00Z",
      confirmed: null,
      modified: null,
      checkedIn: null,
      checkedOut: null,
      cancelled: null
    },
    linkedBookings: [],
    createdAt: new Date("2025-04-18T15:45:00Z")
  },
  {
    id: 3,
    roomId: 15,
    checkInDate: new Date("2025-04-22"),
    checkOutDate: new Date("2025-04-26"),
    status: "confirmed",
    guestIds: [3],
    specialRequests: ["Extra towels", "Wake-up call at 7 AM"],
    paymentDetails: {
      method: "PayPal",
      email: "michael@example.com",
      totalAmount: 396.00,
      deposit: 99.00,
      isPaid: true
    },
    timeline: {
      created: "2025-03-22T09:15:00Z",
      confirmed: "2025-03-22T09:20:00Z",
      modified: null,
      checkedIn: null,
      checkedOut: null,
      cancelled: null
    },
    linkedBookings: [],
    createdAt: new Date("2025-03-22T09:15:00Z")
  }
];

// Sample staff data
export const staffData: Staff[] = [
  {
    id: 1,
    firstName: "Alex",
    lastName: "Morgan",
    email: "alex.morgan@grandhotelspa.com",
    role: "Hotel Manager",
    personalInfo: {
      dateOfBirth: "1982-07-12",
      address: "789 Pine Street, Cityville, CA 94123",
      phone: "+1 (555) 456-7890"
    },
    employmentDetails: {
      startDate: "2020-01-15",
      department: "Management",
      reportsTo: null,
      salary: 85000,
      contractType: "Permanent"
    },
    performance: {
      lastReview: "2024-12-15",
      rating: 4.8,
      comments: "Excellent leadership and organizational skills"
    },
    schedule: [
      { day: "Monday", hours: "8:00-17:00" },
      { day: "Tuesday", hours: "8:00-17:00" },
      { day: "Wednesday", hours: "8:00-17:00" },
      { day: "Thursday", hours: "8:00-17:00" },
      { day: "Friday", hours: "8:00-17:00" }
    ],
    accessPermissions: ["all_access", "finance", "staff_management", "reports"]
  },
  {
    id: 2,
    firstName: "Emily",
    lastName: "Chen",
    email: "emily.chen@grandhotelspa.com",
    role: "Front Desk Manager",
    personalInfo: {
      dateOfBirth: "1988-03-24",
      address: "456 Elm Avenue, Cityville, CA 94123",
      phone: "+1 (555) 567-8901"
    },
    employmentDetails: {
      startDate: "2021-03-10",
      department: "Front Desk",
      reportsTo: 1,
      salary: 65000,
      contractType: "Permanent"
    },
    performance: {
      lastReview: "2024-12-12",
      rating: 4.5,
      comments: "Great with guest relations and problem-solving"
    },
    schedule: [
      { day: "Monday", hours: "7:00-16:00" },
      { day: "Tuesday", hours: "7:00-16:00" },
      { day: "Wednesday", hours: "7:00-16:00" },
      { day: "Thursday", hours: "Off" },
      { day: "Friday", hours: "7:00-16:00" },
      { day: "Saturday", hours: "7:00-16:00" }
    ],
    accessPermissions: ["front_desk", "reservations", "guest_management"]
  },
  {
    id: 3,
    firstName: "David",
    lastName: "Martinez",
    email: "david.martinez@grandhotelspa.com",
    role: "Housekeeping Supervisor",
    personalInfo: {
      dateOfBirth: "1990-11-05",
      address: "123 Cedar Lane, Cityville, CA 94123",
      phone: "+1 (555) 678-9012"
    },
    employmentDetails: {
      startDate: "2022-05-20",
      department: "Housekeeping",
      reportsTo: 1,
      salary: 52000,
      contractType: "Permanent"
    },
    performance: {
      lastReview: "2024-12-10",
      rating: 4.2,
      comments: "Efficient and detail-oriented with room inspections"
    },
    schedule: [
      { day: "Tuesday", hours: "8:00-17:00" },
      { day: "Wednesday", hours: "8:00-17:00" },
      { day: "Thursday", hours: "8:00-17:00" },
      { day: "Friday", hours: "8:00-17:00" },
      { day: "Saturday", hours: "8:00-17:00" },
      { day: "Sunday", hours: "8:00-17:00" }
    ],
    accessPermissions: ["housekeeping", "maintenance_requests"]
  },
  {
    id: 4,
    firstName: "Sophia",
    lastName: "Kim",
    email: "sophia.kim@grandhotelspa.com",
    role: "Finance Manager",
    personalInfo: {
      dateOfBirth: "1985-09-18",
      address: "567 Oak Drive, Cityville, CA 94123",
      phone: "+1 (555) 789-0123"
    },
    employmentDetails: {
      startDate: "2021-01-05",
      department: "Finance",
      reportsTo: 1,
      salary: 78000,
      contractType: "Permanent"
    },
    performance: {
      lastReview: "2024-12-18",
      rating: 4.7,
      comments: "Excellent financial analysis and reporting skills"
    },
    schedule: [
      { day: "Monday", hours: "9:00-18:00" },
      { day: "Tuesday", hours: "9:00-18:00" },
      { day: "Wednesday", hours: "9:00-18:00" },
      { day: "Thursday", hours: "9:00-18:00" },
      { day: "Friday", hours: "9:00-18:00" }
    ],
    accessPermissions: ["finance", "reports", "payroll"]
  }
];

// Sample user data for authentication
export const userData: User[] = [
  {
    id: 1,
    username: "alex.morgan",
    password: "hashed_password_1", // In a real app, this would be securely hashed
    staffId: 1,
    role: "admin"
  },
  {
    id: 2,
    username: "emily.chen",
    password: "hashed_password_2",
    staffId: 2,
    role: "manager"
  },
  {
    id: 3,
    username: "david.martinez",
    password: "hashed_password_3",
    staffId: 3,
    role: "staff"
  },
  {
    id: 4,
    username: "sophia.kim",
    password: "hashed_password_4",
    staffId: 4,
    role: "manager"
  }
];

// Sample finance data
export const financeData: Finance[] = [
  {
    id: 1,
    propertyId: 1,
    date: new Date("2025-04-01"),
    dailyMetrics: {
      totalRevenue: 15872.50,
      roomRevenue: 12650.00,
      foodBeverage: 2342.50,
      spa: 880.00,
      occupancyRate: 0.78,
      averageDailyRate: 189.00,
      revenuePerAvailableRoom: 147.42
    },
    monthlySummaries: [
      {
        month: "January",
        year: 2025,
        totalRevenue: 425680.25,
        expenseTotal: 295470.80,
        netProfit: 130209.45,
        occupancyRate: 0.72
      },
      {
        month: "February",
        year: 2025,
        totalRevenue: 398540.75,
        expenseTotal: 278950.60,
        netProfit: 119590.15,
        occupancyRate: 0.68
      },
      {
        month: "March",
        year: 2025,
        totalRevenue: 458920.50,
        expenseTotal: 312680.90,
        netProfit: 146239.60,
        occupancyRate: 0.75
      }
    ],
    yearlyReports: [
      {
        year: 2023,
        totalRevenue: 4856720.80,
        expenseTotal: 3421650.45,
        netProfit: 1435070.35,
        averageOccupancy: 0.71
      },
      {
        year: 2024,
        totalRevenue: 5235680.50,
        expenseTotal: 3687450.25,
        netProfit: 1548230.25,
        averageOccupancy: 0.74
      }
    ],
    forecastData: {
      nextMonth: {
        projectedRevenue: 472500.00,
        projectedOccupancy: 0.82,
        projectedADR: 195.00
      },
      nextQuarter: {
        projectedRevenue: 1425000.00,
        projectedOccupancy: 0.80,
        projectedADR: 192.00
      }
    },
    expenseCategories: [
      {
        category: "Staffing",
        amount: 156890.45,
        percentOfTotal: 0.48
      },
      {
        category: "Utilities",
        amount: 42780.30,
        percentOfTotal: 0.13
      },
      {
        category: "Maintenance",
        amount: 28950.65,
        percentOfTotal: 0.09
      },
      {
        category: "Supplies",
        amount: 35670.40,
        percentOfTotal: 0.11
      },
      {
        category: "Marketing",
        amount: 25480.20,
        percentOfTotal: 0.08
      },
      {
        category: "Other",
        amount: 34790.80,
        percentOfTotal: 0.11
      }
    ]
  }
];

// Dashboard statistics
export const dashboardStats = {
  occupancyRate: 78,
  occupancyRateChange: 4.3,
  averageDailyRate: 189,
  averageDailyRateChange: 2.1,
  revenuePerRoom: 147,
  revenuePerRoomChange: 7.9,
  pendingBookings: 24,
  pendingBookingsChange: -3.2
};

// Room distribution
export const roomDistribution = [
  { type: "Standard Rooms", total: 30, occupied: 26, percentage: 86 },
  { type: "Deluxe Rooms", total: 24, occupied: 18, percentage: 75 },
  { type: "Executive Suites", total: 12, occupied: 9, percentage: 75 },
  { type: "Presidential Suites", total: 4, occupied: 2, percentage: 50 }
];

// Recent notifications
export const notificationsData = [
  {
    id: 1,
    type: "warning",
    title: "Maintenance Required",
    description: "Room 206 reported AC issues. Maintenance team notified.",
    timestamp: "2 hours ago",
    icon: "error-warning-line"
  },
  {
    id: 2,
    type: "success",
    title: "Payment Received",
    description: "$1,253.00 payment received for reservation #4792.",
    timestamp: "5 hours ago",
    icon: "check-line"
  },
  {
    id: 3,
    type: "info",
    title: "Upcoming VIP Arrival",
    description: "Platinum member arriving tomorrow. Room upgrade recommended.",
    timestamp: "12 hours ago",
    icon: "calendar-check-line"
  }
];

// Get the currently logged in user
export const currentUser = {
  id: 1,
  name: "Alex Morgan",
  role: "Hotel Manager",
  profileImage: "",
  permissions: ["all_access", "finance", "staff_management", "reports"]
};

// Helper function to get rooms by status
export function getRoomsByStatus(status: string): Room[] {
  return roomsData.filter(room => room.status === status);
}

// Helper function to get rooms by category
export function getRoomsByCategory(category: string): Room[] {
  return roomsData.filter(room => room.category === category);
}

// Helper function to get recent reservations sorted by check-in date
export function getRecentReservations(limit: number = 5): Reservation[] {
  return [...reservationsData]
    .sort((a, b) => a.checkInDate.getTime() - b.checkInDate.getTime())
    .slice(0, limit);
}

// Helper function to get guest by ID
export function getGuestById(id: number): Guest | undefined {
  return guestsData.find(guest => guest.id === id);
}

// Helper function to get room by ID
export function getRoomById(id: number): Room | undefined {
  return roomsData.find(room => room.id === id);
}

// Helper function to get staff member by ID
export function getStaffById(id: number): Staff | undefined {
  return staffData.find(staff => staff.id === id);
}

// Get occupancy data for charting
export const occupancyTrendData = [
  { month: "Jan", current: 65, previous: 60 },
  { month: "Feb", current: 59, previous: 55 },
  { month: "Mar", current: 80, previous: 70 },
  { month: "Apr", current: 81, previous: 75 },
  { month: "May", current: 56, previous: 60 },
  { month: "Jun", current: 55, previous: 52 },
  { month: "Jul", current: 70, previous: 65 },
  { month: "Aug", current: 68, previous: 62 },
  { month: "Sep", current: 74, previous: 70 },
  { month: "Oct", current: 82, previous: 76 },
  { month: "Nov", current: 88, previous: 80 },
  { month: "Dec", current: 74, previous: 70 }
];
