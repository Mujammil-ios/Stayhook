import { useState } from "react";
import { staffData } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { StaffModal } from "@/components/forms/staff/StaffModal";

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showStaffModal, setShowStaffModal] = useState(false);

  const filteredStaff = staffData.filter(staff => {
    // Filter by role
    if (roleFilter !== "all" && staff.role !== roleFilter) return false;
    
    // Filter by search term (name, email, etc)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const staffName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
      const staffEmail = staff.email.toLowerCase();
      
      if (!staffName.includes(searchLower) && !staffEmail.includes(searchLower)) {
        return false;
      }
    }
    
    return true;
  });

  // Get unique roles for filter
  const roles = Array.from(new Set(staffData.map(staff => staff.role)));

  // Performance data for chart
  const performanceData = staffData.map(staff => ({
    name: `${staff.firstName} ${staff.lastName}`,
    value: staff.performance.rating * 20 // Convert to percentage
  }));

  // Department distribution for pie chart
  const departmentData = [
    { name: "Management", value: 1 },
    { name: "Front Desk", value: 1 },
    { name: "Housekeeping", value: 1 },
    { name: "Finance", value: 1 }
  ];

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  return (
    <div>
      <div className="mb-6 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Staff Portal</h1>
        <div className="mt-3 sm:mt-0">
          <Button onClick={() => setShowStaffModal(true)}>
            <i className="ri-user-add-line mr-2"></i>
            Add New Staff
          </Button>
        </div>
      </div>

      <Tabs defaultValue="directory" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="directory">Staff Directory</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="directory">
          <Card className="glass mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"></i>
                  <Input
                    type="text"
                    placeholder="Search staff..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="text-right">
                  <span className="text-sm text-neutral-500">
                    Showing {filteredStaff.length} of {staffData.length} staff members
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-lg font-medium mr-3">
                            {staff.firstName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{staff.firstName} {staff.lastName}</div>
                            <div className="text-xs text-neutral-500">Since {staff.employmentDetails.startDate}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{staff.role}</TableCell>
                      <TableCell>{staff.employmentDetails.department}</TableCell>
                      <TableCell>
                        <div>{staff.email}</div>
                        <div className="text-xs text-neutral-500">{staff.personalInfo.phone}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="mr-2 w-16 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${staff.performance.rating * 20}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{staff.performance.rating}/5</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <button 
                            className="text-primary hover:text-primary-600 tooltip" 
                            data-tooltip="View"
                            onClick={() => setShowStaffModal(true)}
                          >
                            <i className="ri-eye-line"></i>
                          </button>
                          <button 
                            className="text-primary hover:text-primary-600 tooltip" 
                            data-tooltip="Edit"
                            onClick={() => setShowStaffModal(true)}
                          >
                            <i className="ri-pencil-line"></i>
                          </button>
                          <button 
                            className="text-primary hover:text-primary-600 tooltip" 
                            data-tooltip="Schedule"
                          >
                            <i className="ri-calendar-line"></i>
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="glass lg:col-span-2">
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left p-2 font-medium">Staff</th>
                        <th className="text-center p-2 font-medium">Mon</th>
                        <th className="text-center p-2 font-medium">Tue</th>
                        <th className="text-center p-2 font-medium">Wed</th>
                        <th className="text-center p-2 font-medium">Thu</th>
                        <th className="text-center p-2 font-medium">Fri</th>
                        <th className="text-center p-2 font-medium">Sat</th>
                        <th className="text-center p-2 font-medium">Sun</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffData.map((staff) => {
                        // Create a lookup of day to hours
                        const schedule: Record<string, string> = {};
                        staff.schedule.forEach(item => {
                          schedule[item.day] = item.hours;
                        });

                        return (
                          <tr key={staff.id} className="border-t border-neutral-200 dark:border-neutral-700">
                            <td className="p-2">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-sm font-medium mr-2">
                                  {staff.firstName.charAt(0)}
                                </div>
                                <span>{staff.firstName} {staff.lastName}</span>
                              </div>
                            </td>
                            <td className="p-2 text-center">
                              {schedule["Monday"] || <span className="text-neutral-400">Off</span>}
                            </td>
                            <td className="p-2 text-center">
                              {schedule["Tuesday"] || <span className="text-neutral-400">Off</span>}
                            </td>
                            <td className="p-2 text-center">
                              {schedule["Wednesday"] || <span className="text-neutral-400">Off</span>}
                            </td>
                            <td className="p-2 text-center">
                              {schedule["Thursday"] || <span className="text-neutral-400">Off</span>}
                            </td>
                            <td className="p-2 text-center">
                              {schedule["Friday"] || <span className="text-neutral-400">Off</span>}
                            </td>
                            <td className="p-2 text-center">
                              {schedule["Saturday"] || <span className="text-neutral-400">Off</span>}
                            </td>
                            <td className="p-2 text-center">
                              {schedule["Sunday"] || <span className="text-neutral-400">Off</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} staff`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-neutral-500">Total: {staffData.length} staff members</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Staff Performance Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staffData.map((staff) => (
                    <div key={staff.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-sm font-medium mr-2">
                            {staff.firstName.charAt(0)}
                          </div>
                          <span>{staff.firstName} {staff.lastName}</span>
                        </div>
                        <span className="text-sm">{staff.performance.rating}/5</span>
                      </div>
                      <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out" 
                          style={{ width: `${staff.performance.rating * 20}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-neutral-500">Last review: {staff.performance.lastReview}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Performance Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staffData.map((staff) => (
                    <div key={staff.id} className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                      <div className="flex items-center mb-2">
                        <div className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-sm font-medium mr-2">
                          {staff.firstName.charAt(0)}
                        </div>
                        <span className="font-medium">{staff.firstName} {staff.lastName}</span>
                      </div>
                      <p className="text-sm">{staff.performance.comments}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Staff Modal */}
      <StaffModal 
        isOpen={showStaffModal}
        onClose={() => setShowStaffModal(false)}
      />
    </div>
  );
};

export default Staff;
