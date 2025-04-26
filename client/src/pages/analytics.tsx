import { useState } from "react";
import { financeData, occupancyTrendData, roomDistribution } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useTheme } from "@/hooks/useTheme";

const Analytics = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [timeRange, setTimeRange] = useState("month");
  const [year, setYear] = useState("2025");

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Monthly revenue data
  const monthlyRevenue = [
    { month: "Jan", revenue: 425680 },
    { month: "Feb", revenue: 398540 },
    { month: "Mar", revenue: 458920 },
    { month: "Apr", revenue: 442500 },
    { month: "May", revenue: 485300 },
    { month: "Jun", revenue: 512400 },
    { month: "Jul", revenue: 535600 },
    { month: "Aug", revenue: 556200 },
    { month: "Sep", revenue: 498700 },
    { month: "Oct", revenue: 472300 },
    { month: "Nov", revenue: 448900 },
    { month: "Dec", revenue: 510800 },
  ];

  // Revenue by source
  const revenueBySource = [
    { name: "Room Bookings", value: 75 },
    { name: "Restaurant & Bar", value: 15 },
    { name: "Spa & Wellness", value: 5 },
    { name: "Events & Conferences", value: 5 },
  ];

  // Colors for charts
  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  // Expense data from finance
  const expenseData = financeData[0].expenseCategories.map(category => ({
    name: category.category,
    value: category.amount,
    percentage: category.percentOfTotal * 100
  }));

  return (
    <div>
      <div className="mb-6 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Revenue Analytics</h1>
        <div className="mt-3 sm:mt-0 flex space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="quarter">Quarterly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <i className="ri-download-line mr-2"></i>
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-primary-100 dark:bg-primary-900 p-3">
                <i className="ri-money-dollar-circle-line text-xl text-primary-600 dark:text-primary-300"></i>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-neutral-500 truncate">Total Revenue</dt>
                  <dd className="text-2xl font-semibold">{formatCurrency(5235680)}</dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-green-100 dark:bg-green-900 p-3">
                <i className="ri-line-chart-line text-xl text-green-600 dark:text-green-300"></i>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-neutral-500 truncate">Net Profit</dt>
                  <dd className="text-2xl font-semibold">{formatCurrency(1548230)}</dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-amber-100 dark:bg-amber-900 p-3">
                <i className="ri-hotel-bed-line text-xl text-amber-600 dark:text-amber-300"></i>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-neutral-500 truncate">Average Occupancy</dt>
                  <dd className="text-2xl font-semibold">74%</dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-red-100 dark:bg-red-900 p-3">
                <i className="ri-funds-line text-xl text-red-600 dark:text-red-300"></i>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-neutral-500 truncate">RevPAR</dt>
                  <dd className="text-2xl font-semibold">$147</dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Trend */}
            <Card className="glass lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyRevenue}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
                      <XAxis dataKey="month" stroke={isDark ? "#9ca3af" : "#6b7280"} />
                      <YAxis 
                        stroke={isDark ? "#9ca3af" : "#6b7280"}
                        tickFormatter={(value) => `$${value / 1000}k`}
                      />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value as number), "Revenue"]}
                        contentStyle={{ 
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#e5e7eb',
                          color: isDark ? '#f3f4f6' : '#1f2937'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" name="Monthly Revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue by Source */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Revenue by Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueBySource}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {revenueBySource.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="occupancy">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Occupancy Trend */}
            <Card className="glass lg:col-span-2">
              <CardHeader>
                <CardTitle>Occupancy Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={occupancyTrendData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
                      <XAxis 
                        dataKey="month" 
                        stroke={isDark ? "#9ca3af" : "#6b7280"} 
                      />
                      <YAxis 
                        stroke={isDark ? "#9ca3af" : "#6b7280"} 
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Occupancy']}
                        contentStyle={{ 
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#e5e7eb',
                          color: isDark ? '#f3f4f6' : '#1f2937'
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="current"
                        name="Current Year"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="previous"
                        name="Previous Year"
                        stroke="hsl(var(--muted-foreground))"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Room Distribution */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Room Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roomDistribution.map((room, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{room.type}</div>
                        <div className="text-sm text-neutral-500">{room.occupied}/{room.total} ({room.percentage}%)</div>
                      </div>
                      <div className="mt-2 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            index === 0 ? "bg-primary" : 
                            index === 1 ? "bg-secondary" : 
                            index === 2 ? "bg-accent" : "bg-destructive"
                          }`} 
                          style={{ width: `${room.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                  <h4 className="text-sm font-medium mb-3">Occupancy by Day of Week</h4>
                  <div className="grid grid-cols-7 gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                      <div key={day} className="text-center">
                        <div className="text-xs mb-1">{day}</div>
                        <div 
                          className="h-16 bg-primary-100 dark:bg-primary-900 rounded-md flex items-end justify-center overflow-hidden"
                        >
                          <div 
                            className="bg-primary w-full transition-all duration-500 ease-in-out"
                            style={{ 
                              height: `${index < 5 ? 70 + Math.random() * 20 : 90 + Math.random() * 10}%` 
                            }}
                          ></div>
                        </div>
                        <div className="text-xs mt-1">
                          {index < 5 ? `${Math.floor(70 + Math.random() * 20)}%` : `${Math.floor(90 + Math.random() * 10)}%`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Expenses Breakdown */}
            <Card className="glass lg:col-span-2">
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={expenseData}
                      layout="vertical"
                      margin={{
                        top: 20,
                        right: 30,
                        left: 100,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
                      <XAxis 
                        type="number" 
                        stroke={isDark ? "#9ca3af" : "#6b7280"}
                        tickFormatter={(value) => `$${value / 1000}k`}  
                      />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        stroke={isDark ? "#9ca3af" : "#6b7280"} 
                        width={80}
                      />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value as number), 'Amount']}
                        contentStyle={{ 
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#e5e7eb',
                          color: isDark ? '#f3f4f6' : '#1f2937'
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="value" 
                        name="Expenses" 
                        fill="hsl(var(--primary))" 
                        radius={[0, 4, 4, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Expense Percentage */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Expense Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [formatCurrency(value as number), 'Amount']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecast">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Revenue Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">Next Month</h3>
                      <span className="text-sm text-green-600">+2.9% vs current</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <div className="text-3xl font-bold">{formatCurrency(financeData[0].forecastData.nextMonth.projectedRevenue)}</div>
                      <div className="text-sm text-neutral-500">
                        <div>Projected Occupancy: {financeData[0].forecastData.nextMonth.projectedOccupancy * 100}%</div>
                        <div>Projected ADR: ${financeData[0].forecastData.nextMonth.projectedADR}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">Next Quarter</h3>
                      <span className="text-sm text-green-600">+3.5% vs current</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <div className="text-3xl font-bold">{formatCurrency(financeData[0].forecastData.nextQuarter.projectedRevenue)}</div>
                      <div className="text-sm text-neutral-500">
                        <div>Projected Occupancy: {financeData[0].forecastData.nextQuarter.projectedOccupancy * 100}%</div>
                        <div>Projected ADR: ${financeData[0].forecastData.nextQuarter.projectedADR}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">Annual Projection</h3>
                      <span className="text-sm text-green-600">+4.2% YoY</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <div className="text-3xl font-bold">{formatCurrency(5475000)}</div>
                      <div className="text-sm text-neutral-500">
                        <div>Projected Occupancy: 81%</div>
                        <div>Projected ADR: $198</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Demand Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Website Traffic</span>
                      <span className="text-sm text-green-600">+12% vs last month</span>
                    </div>
                    <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <div className="mt-1 text-xs text-neutral-500">15,420 unique visitors in the last 30 days</div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Direct Bookings</span>
                      <span className="text-sm text-green-600">+8% vs last month</span>
                    </div>
                    <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div className="bg-secondary h-full rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <div className="mt-1 text-xs text-neutral-500">682 bookings in the last 30 days</div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Search Impressions</span>
                      <span className="text-sm text-green-600">+15% vs last month</span>
                    </div>
                    <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div className="bg-accent h-full rounded-full" style={{ width: '82%' }}></div>
                    </div>
                    <div className="mt-1 text-xs text-neutral-500">28,750 impressions in the last 30 days</div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">OTA Bookings</span>
                      <span className="text-sm text-amber-600">+2% vs last month</span>
                    </div>
                    <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div className="bg-destructive h-full rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <div className="mt-1 text-xs text-neutral-500">375 bookings in the last 30 days</div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <h4 className="font-medium mb-2">Upcoming Events Impact</h4>
                    <div className="space-y-2">
                      <div className="p-3 rounded bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800">
                        <div className="flex justify-between">
                          <span className="font-medium">City Music Festival</span>
                          <span>May 15-18</span>
                        </div>
                        <div className="text-xs mt-1">
                          Expected occupancy boost: +25%
                        </div>
                      </div>
                      <div className="p-3 rounded bg-secondary-50 dark:bg-secondary-900/30 border border-secondary-200 dark:border-secondary-800">
                        <div className="flex justify-between">
                          <span className="font-medium">Tech Conference 2025</span>
                          <span>Jun 5-9</span>
                        </div>
                        <div className="text-xs mt-1">
                          Expected occupancy boost: +35%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
