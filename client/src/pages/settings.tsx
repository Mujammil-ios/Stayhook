import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { propertyData, staffData, currentUser } from "@/lib/data";
import { useTheme } from "@/hooks/useTheme";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  
  // Form states
  const [hotelName, setHotelName] = useState(propertyData.name);
  const [hotelAddress, setHotelAddress] = useState(propertyData.address);
  const [hotelDescription, setHotelDescription] = useState(propertyData.description);
  const [contactEmail, setContactEmail] = useState(propertyData.contactInfo.email);
  const [contactPhone, setContactPhone] = useState(propertyData.contactInfo.phone);
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [dailyReports, setDailyReports] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  
  const [primaryColor, setPrimaryColor] = useState("blue");
  const [fontSize, setFontSize] = useState("medium");
  const [autoSave, setAutoSave] = useState(true);
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Property Information</CardTitle>
                <CardDescription>
                  Update your hotel's basic information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hotel-name">Hotel Name</Label>
                    <Input 
                      id="hotel-name" 
                      value={hotelName} 
                      onChange={(e) => setHotelName(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hotel-address">Address</Label>
                    <Input 
                      id="hotel-address" 
                      value={hotelAddress} 
                      onChange={(e) => setHotelAddress(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hotel-description">Description</Label>
                    <Textarea 
                      id="hotel-description" 
                      rows={4}
                      value={hotelDescription} 
                      onChange={(e) => setHotelDescription(e.target.value)} 
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save Changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Update contact details for your hotel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email Address</Label>
                    <Input 
                      id="contact-email" 
                      type="email"
                      value={contactEmail} 
                      onChange={(e) => setContactEmail(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Phone Number</Label>
                    <Input 
                      id="contact-phone" 
                      value={contactPhone} 
                      onChange={(e) => setContactPhone(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact-website">Website</Label>
                    <Input 
                      id="contact-website" 
                      defaultValue={propertyData.contactInfo.website} 
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save Changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-neutral-500">Receive notifications via email</p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-neutral-500">Receive notifications via text message</p>
                  </div>
                  <Switch 
                    id="sms-notifications" 
                    checked={smsNotifications} 
                    onCheckedChange={setSmsNotifications} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="daily-reports">Daily Reports</Label>
                    <p className="text-sm text-neutral-500">Receive daily summary reports</p>
                  </div>
                  <Switch 
                    id="daily-reports" 
                    checked={dailyReports} 
                    onCheckedChange={setDailyReports} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="security-alerts">Security Alerts</Label>
                    <p className="text-sm text-neutral-500">Receive alerts about security events</p>
                  </div>
                  <Switch 
                    id="security-alerts" 
                    checked={securityAlerts} 
                    onCheckedChange={setSecurityAlerts} 
                  />
                </div>
                
                <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
                  <h3 className="font-medium mb-4">Notification Types</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="bookings" className="rounded border-neutral-300 dark:border-neutral-600" defaultChecked />
                        <Label htmlFor="bookings">New Bookings</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="cancellations" className="rounded border-neutral-300 dark:border-neutral-600" defaultChecked />
                        <Label htmlFor="cancellations">Cancellations</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="check-ins" className="rounded border-neutral-300 dark:border-neutral-600" defaultChecked />
                        <Label htmlFor="check-ins">Check-ins</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="check-outs" className="rounded border-neutral-300 dark:border-neutral-600" defaultChecked />
                        <Label htmlFor="check-outs">Check-outs</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="payments" className="rounded border-neutral-300 dark:border-neutral-600" defaultChecked />
                        <Label htmlFor="payments">Payments</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="maintenance" className="rounded border-neutral-300 dark:border-neutral-600" defaultChecked />
                        <Label htmlFor="maintenance">Maintenance</Label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>Save Preferences</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <div className="flex gap-4">
                    <div 
                      className={`p-4 rounded-md border cursor-pointer transition-all ${
                        theme === 'light' 
                          ? 'border-primary bg-primary/10' 
                          : 'border-neutral-200 dark:border-neutral-700'
                      }`}
                      onClick={() => setTheme('light')}
                    >
                      <div className="h-12 w-12 bg-white rounded-md border border-neutral-200 flex items-center justify-center">
                        <i className="ri-sun-line text-xl text-neutral-800"></i>
                      </div>
                      <div className="mt-2 text-center text-sm font-medium">Light</div>
                    </div>
                    
                    <div 
                      className={`p-4 rounded-md border cursor-pointer transition-all ${
                        theme === 'dark' 
                          ? 'border-primary bg-primary/10' 
                          : 'border-neutral-200 dark:border-neutral-700'
                      }`}
                      onClick={() => setTheme('dark')}
                    >
                      <div className="h-12 w-12 bg-neutral-800 rounded-md border border-neutral-700 flex items-center justify-center">
                        <i className="ri-moon-line text-xl text-white"></i>
                      </div>
                      <div className="mt-2 text-center text-sm font-medium">Dark</div>
                    </div>
                    
                    <div 
                      className={`p-4 rounded-md border cursor-pointer transition-all ${
                        theme === 'system' 
                          ? 'border-primary bg-primary/10' 
                          : 'border-neutral-200 dark:border-neutral-700'
                      }`}
                      onClick={() => setTheme('system')}
                    >
                      <div className="h-12 w-12 bg-gradient-to-br from-white to-neutral-800 rounded-md border border-neutral-200 flex items-center justify-center">
                        <i className="ri-computer-line text-xl text-neutral-500"></i>
                      </div>
                      <div className="mt-2 text-center text-sm font-medium">System</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <Select value={primaryColor} onValueChange={setPrimaryColor}>
                    <SelectTrigger id="primary-color">
                      <SelectValue placeholder="Select primary color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="amber">Amber</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="font-size">Font Size</Label>
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger id="font-size">
                      <SelectValue placeholder="Select font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-save">Auto-save Changes</Label>
                    <p className="text-sm text-neutral-500">Automatically save form changes</p>
                  </div>
                  <Switch 
                    id="auto-save" 
                    checked={autoSave} 
                    onCheckedChange={setAutoSave} 
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button>Save Preferences</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Manage your password and security settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Update Password</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Login Sessions</CardTitle>
                <CardDescription>
                  Manage your active login sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-300">
                            <i className="ri-computer-line text-lg"></i>
                          </div>
                          <div className="ml-3">
                            <div className="font-medium">Current Session</div>
                            <div className="text-xs text-neutral-500">
                              Windows • Chrome • {new Date().toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                          Active
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center text-neutral-600 dark:text-neutral-300">
                            <i className="ri-smartphone-line text-lg"></i>
                          </div>
                          <div className="ml-3">
                            <div className="font-medium">Mobile Device</div>
                            <div className="text-xs text-neutral-500">
                              iOS • Safari • {new Date(Date.now() - 86400000).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="text-red-500 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30">
                          Logout
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <h3 className="font-medium mb-4">Two-Factor Authentication</h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-medium">Enable 2FA</p>
                        <p className="text-sm text-neutral-500">Add an extra layer of security to your account</p>
                      </div>
                      <Button variant="outline">Setup 2FA</Button>
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

export default Settings;
