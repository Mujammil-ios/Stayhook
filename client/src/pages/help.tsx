import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Help = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // FAQ data
  const faqs = [
    {
      id: "1",
      question: "How do I create a new reservation?",
      answer: "To create a new reservation, navigate to the Reservation System page and click the 'New Booking' button. Select the room type, dates, and guest information to complete the booking."
    },
    {
      id: "2",
      question: "How do I modify an existing booking?",
      answer: "To modify a booking, go to the Booking History page, find the booking you want to edit, and click the edit (pencil) icon. You can change dates, room type, and other details as needed."
    },
    {
      id: "3",
      question: "How do I process a refund?",
      answer: "To process a refund, navigate to the Booking History page, find the relevant booking, and click on it to view details. In the payment section, click 'Process Refund' and follow the prompts."
    },
    {
      id: "4",
      question: "How do I add a new staff member?",
      answer: "To add a new staff member, go to the Staff Portal page and click the 'Add New Staff' button. Fill out the required information including personal details, role, and access permissions."
    },
    {
      id: "5",
      question: "How can I generate reports?",
      answer: "To generate reports, navigate to the Revenue Analytics page and use the filters to select the time period and data you want to analyze. Click the 'Export' button to download the report."
    },
    {
      id: "6",
      question: "How do I update room rates?",
      answer: "To update room rates, go to the Room Management page, select the room or room type you want to modify, click the edit button, and update the base rate and dynamic pricing settings."
    },
    {
      id: "7",
      question: "How do I mark a room for maintenance?",
      answer: "To mark a room for maintenance, navigate to the Room Management page, find the room in the list or grid view, click the maintenance (tools) icon, and add maintenance details."
    },
    {
      id: "8",
      question: "How do I set up notifications?",
      answer: "To configure notifications, go to the Settings page and select the Notifications tab. You can enable or disable different notification types and choose your preferred delivery methods."
    }
  ];

  // Video tutorials
  const tutorials = [
    {
      id: "1",
      title: "Getting Started with HotelHub",
      duration: "5:32",
      thumbnail: "getting-started.jpg"
    },
    {
      id: "2",
      title: "Managing Reservations",
      duration: "8:45",
      thumbnail: "reservations.jpg"
    },
    {
      id: "3",
      title: "Room Management Best Practices",
      duration: "6:18",
      thumbnail: "room-management.jpg"
    },
    {
      id: "4",
      title: "Staff Portal Tutorial",
      duration: "7:24",
      thumbnail: "staff-portal.jpg"
    },
    {
      id: "5",
      title: "Understanding Analytics",
      duration: "10:15",
      thumbnail: "analytics.jpg"
    },
    {
      id: "6",
      title: "Advanced Settings Configuration",
      duration: "9:36",
      thumbnail: "settings.jpg"
    }
  ];

  // Support team members
  const supportTeam = [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Customer Support Manager",
      email: "sarah.j@hotelhub.example.com",
      availability: "Mon-Fri, 9am-5pm ET"
    },
    {
      id: "2",
      name: "Michael Chen",
      role: "Technical Support Specialist",
      email: "michael.c@hotelhub.example.com",
      availability: "Mon-Fri, 8am-4pm ET"
    },
    {
      id: "3",
      name: "Priya Patel",
      role: "Training Specialist",
      email: "priya.p@hotelhub.example.com",
      availability: "Tue-Sat, 10am-6pm ET"
    }
  ];

  // Filter FAQs based on search term
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Help & Support</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Find answers to common questions or contact our support team
        </p>
      </div>

      <Card className="glass mb-6">
        <CardContent className="p-6">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xl"></i>
              <Input
                className="pl-10 py-6 text-lg"
                placeholder="Search for help topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-3 justify-center">
              <Button variant="outline" size="sm" onClick={() => setSearchTerm("reservation")}>Reservations</Button>
              <Button variant="outline" size="sm" onClick={() => setSearchTerm("payment")}>Payments</Button>
              <Button variant="outline" size="sm" onClick={() => setSearchTerm("room")}>Rooms</Button>
              <Button variant="outline" size="sm" onClick={() => setSearchTerm("staff")}>Staff</Button>
              <Button variant="outline" size="sm" onClick={() => setSearchTerm("report")}>Reports</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
          <TabsTrigger value="tutorials">Video Tutorials</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
        </TabsList>

        <TabsContent value="faq">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {filteredFaqs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        <p>{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-12">
                  <i className="ri-question-mark-circle-line text-4xl text-neutral-400"></i>
                  <h3 className="mt-4 text-lg font-medium">No results found</h3>
                  <p className="mt-2 text-sm text-neutral-500">
                    Try searching with different keywords or browse our video tutorials
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tutorials">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tutorials.map((tutorial) => (
              <Card key={tutorial.id} className="glass overflow-hidden">
                <div className="aspect-video bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                  <i className="ri-video-line text-3xl text-neutral-400"></i>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium">{tutorial.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-neutral-500">
                      <i className="ri-time-line mr-1"></i> {tutorial.duration}
                    </span>
                    <Button variant="outline" size="sm">
                      <i className="ri-play-line mr-1"></i> Watch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="glass lg:col-span-3">
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Name</label>
                      <Input id="name" placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <Input id="email" type="email" placeholder="Your email" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                    <Input id="subject" placeholder="Support request subject" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">Category</label>
                    <select id="category" className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2">
                      <option value="">Select a category</option>
                      <option value="reservation">Reservation System</option>
                      <option value="rooms">Room Management</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="technical">Technical Issues</option>
                      <option value="account">Account Access</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <textarea 
                      id="message" 
                      rows={6} 
                      placeholder="Describe your issue or question in detail..."
                      className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2"
                    ></textarea>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="attachment" className="text-sm font-medium">Attachments (Optional)</label>
                    <Input id="attachment" type="file" />
                    <p className="text-xs text-neutral-500">Max file size: 10MB. Supported formats: JPG, PNG, PDF.</p>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>
                      <i className="ri-send-plane-line mr-2"></i>
                      Submit Request
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="glass lg:col-span-2">
              <CardHeader>
                <CardTitle>Support Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {supportTeam.map((member) => (
                    <div key={member.id} className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 font-medium">
                        {member.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-neutral-500">{member.role}</p>
                        <p className="text-sm">{member.email}</p>
                        <p className="text-xs text-neutral-500 mt-1">Available: {member.availability}</p>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-700">
                    <h3 className="font-medium mb-2">Contact Hours</h3>
                    <p className="text-sm">Monday-Friday: 9am-6pm ET</p>
                    <p className="text-sm">Saturday: 10am-4pm ET</p>
                    <p className="text-sm">Sunday: Closed</p>
                    
                    <div className="mt-4">
                      <p className="text-sm font-medium">Emergency Support</p>
                      <p className="text-sm">For urgent issues outside business hours:</p>
                      <p className="text-sm mt-1">
                        <i className="ri-phone-line mr-1"></i> +1 (555) 123-4567
                      </p>
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

export default Help;
