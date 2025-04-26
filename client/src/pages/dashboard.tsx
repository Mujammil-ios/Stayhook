import { useState } from "react";
import { Link } from "wouter";
import { 
  dashboardStats, 
  roomDistribution, 
  notificationsData, 
  getRecentReservations,
  getGuestById,
  getRoomById,
} from "@/lib/data";
import StatCard from "@/components/dashboard/StatCard";
import ChartBar from "@/components/dashboard/ChartBar";
import OccupancyChart from "@/components/dashboard/OccupancyChart";
import AlertItem from "@/components/dashboard/AlertItem";
import { CreatePropertyModal } from "@/components/forms/property/CreatePropertyModal";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState("24h");
  const [isCreatePropertyModalOpen, setIsCreatePropertyModalOpen] = useState(false);
  const recentBookings = getRecentReservations(3);

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300";
      default:
        return "bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-300";
    }
  };

  return (
    <div>
      {/* Page title and actions */}
      <div className="mb-6 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="mt-3 sm:mt-0 flex space-x-3">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button className="mr-2" variant="secondary" onClick={() => setIsCreatePropertyModalOpen(true)}>
            <i className="ri-add-line mr-2"></i>
            Create Property
          </Button>
          <Button>
            <i className="ri-download-line mr-2"></i>
            Export
          </Button>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          icon="hotel-bed-line" 
          iconBgColor="bg-primary-100 dark:bg-primary-900" 
          iconTextColor="text-primary-600 dark:text-primary-300" 
          title="Occupancy Rate" 
          value={dashboardStats.occupancyRate} 
          change={dashboardStats.occupancyRateChange} 
          isPercentage={true} 
        />
        
        <StatCard 
          icon="money-dollar-circle-line" 
          iconBgColor="bg-green-100 dark:bg-green-900" 
          iconTextColor="text-green-600 dark:text-green-300" 
          title="Average Daily Rate" 
          value={dashboardStats.averageDailyRate} 
          change={dashboardStats.averageDailyRateChange} 
          prefix="$" 
        />
        
        <StatCard 
          icon="funds-line" 
          iconBgColor="bg-amber-100 dark:bg-amber-900" 
          iconTextColor="text-amber-600 dark:text-amber-300" 
          title="RevPAR" 
          value={dashboardStats.revenuePerRoom} 
          change={dashboardStats.revenuePerRoomChange} 
          prefix="$" 
        />
        
        <StatCard 
          icon="calendar-todo-line" 
          iconBgColor="bg-red-100 dark:bg-red-900" 
          iconTextColor="text-red-600 dark:text-red-300" 
          title="Pending Bookings" 
          value={dashboardStats.pendingBookings} 
          change={dashboardStats.pendingBookingsChange} 
        />
      </div>
      
      {/* Charts and data */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Occupancy chart */}
        <Card className="glass col-span-1 lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium">Occupancy Trend</h3>
            <div className="mt-2 text-sm text-neutral-500">
              <span>Past 30 days compared to previous period</span>
            </div>
            <div className="mt-6 h-64">
              <OccupancyChart />
            </div>
          </CardContent>
        </Card>
        
        {/* Room type distribution */}
        <Card className="glass">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium">Room Distribution</h3>
            <div className="mt-2 text-sm text-neutral-500">
              <span>By room type and status</span>
            </div>
            <div className="mt-6">
              <div className="space-y-4">
                {roomDistribution.map((item, index) => (
                  <ChartBar 
                    key={index}
                    label={item.type}
                    total={item.total}
                    occupied={item.occupied}
                    percentage={item.percentage}
                    color={index === 0 ? "bg-primary" : 
                           index === 1 ? "bg-secondary" : 
                           index === 2 ? "bg-accent" : "bg-destructive"}
                  />
                ))}
              </div>
              <div className="mt-6">
                <Button variant="default" size="sm" asChild>
                  <Link href="/room-types" className="flex items-center">
                    <span>View All Room Types</span>
                    <i className="ri-arrow-right-line ml-2"></i>
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent bookings and alerts */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent bookings */}
        <Card className="glass col-span-1 lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Recent Bookings</h3>
              <Link href="/recent-bookings" className="text-sm font-medium text-primary hover:text-primary-600 flex items-center">
                <span>View all</span>
                <i className="ri-arrow-right-s-line ml-1"></i>
              </Link>
            </div>
            <div className="mt-4 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                    <thead>
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-500 sm:pl-0">Guest</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-500">Room</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-500">Check In</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-neutral-500">Status</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                      {recentBookings.map((booking) => {
                        const guest = getGuestById(booking.guestIds[0]);
                        const room = getRoomById(booking.roomId);
                        
                        return (
                          <tr key={booking.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-lg font-medium">
                                  {guest?.firstName.charAt(0)}
                                </div>
                                <div className="ml-4">
                                  <div className="font-medium">{guest?.firstName} {guest?.lastName}</div>
                                  <div className="text-neutral-500">{guest?.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <div className="font-medium">Room {room?.number}</div>
                              <div className="text-neutral-500">{room?.category}</div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <div>{format(booking.checkInDate, "MMMM dd, yyyy")}</div>
                              <div className="text-neutral-500">
                                {Math.ceil((booking.checkOutDate.getTime() - booking.checkInDate.getTime()) / (1000 * 60 * 60 * 24))} nights
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <Badge variant="outline" className={getStatusBadgeClasses(booking.status)}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                              <button type="button" className="text-primary hover:text-primary-600 mx-2 tooltip" data-tooltip="View details">
                                <i className="ri-eye-line"></i>
                              </button>
                              <button type="button" className="text-primary hover:text-primary-600 mx-2 tooltip" data-tooltip="Edit">
                                <i className="ri-pencil-line"></i>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Alerts and notifications */}
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Alerts & Notifications</h3>
              <a href="#" className="text-sm font-medium text-primary hover:text-primary-600">View all</a>
            </div>
            <ul className="mt-4 space-y-4">
              {notificationsData.map((notification) => (
                <AlertItem 
                  key={notification.id}
                  type={notification.type as "warning" | "success" | "info"}
                  icon={notification.icon}
                  title={notification.title}
                  description={notification.description}
                  timestamp={notification.timestamp}
                />
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Create Property Modal */}
      <CreatePropertyModal 
        isOpen={isCreatePropertyModalOpen} 
        onClose={() => setIsCreatePropertyModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
