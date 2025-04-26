import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

// Frequently asked questions
const faqs = [
  {
    question: "How do I make a reservation?",
    answer: "You can make a reservation through our website by navigating to the Bookings page, or by contacting our reservation desk directly. Select your check-in and check-out dates, choose your preferred room type, and provide your contact information to complete the booking process."
  },
  {
    question: "What is the cancellation policy?",
    answer: "Our standard cancellation policy allows for free cancellation up to 48 hours before the scheduled check-in time. Cancellations made within 48 hours of the check-in time may incur a charge of one night's stay. Please note that special rates or promotions may have different cancellation terms."
  },
  {
    question: "Is breakfast included in the room rate?",
    answer: "Breakfast inclusion varies by room type and rate. When making your reservation, the breakfast inclusion will be clearly indicated. If your rate doesn't include breakfast, you can add it during booking or at the hotel for an additional charge."
  },
  {
    question: "What time is check-in and check-out?",
    answer: "Standard check-in time is 3:00 PM, and check-out time is 12:00 PM (noon). Early check-in and late check-out may be available upon request, subject to availability and possibly an additional fee."
  },
  {
    question: "Do you offer airport transfers?",
    answer: "Yes, we provide airport transfer services for an additional fee. Please contact our concierge at least 24 hours in advance to arrange transportation. Provide your flight details, and our staff will help coordinate your pickup or drop-off."
  },
  {
    question: "Is there a loyalty program for frequent guests?",
    answer: "Yes, we offer a loyalty program for our frequent guests. Members earn points for each stay, which can be redeemed for room upgrades, complimentary nights, or other exclusive benefits. You can join the program at reception during your stay or on our website."
  }
];

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function CustomerSupport() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log("Support form submission:", formData);
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
        
        setIsSubmitting(false);
        
        // Show success toast
        toast({
          title: "Support Request Sent",
          description: "Thank you for your message. Our team will respond shortly.",
          variant: "default",
        });
      }, 1000);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Customer Support</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Get help with your questions or submit a support request
          </p>
        </div>
        <Button variant="outline" size="sm" asChild className="self-start">
          <Link href="/" className="flex items-center">
            <i className="ri-arrow-left-line mr-2 text-lg"></i>
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Support Form */}
        <div className="lg:col-span-2">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Fill out the form below and our support team will get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Briefly describe your issue"
                    value={formData.subject}
                    onChange={handleChange}
                    className={errors.subject ? "border-destructive" : ""}
                  />
                  {errors.subject && (
                    <p className="text-sm text-destructive">{errors.subject}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Provide details about your question or issue"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className={errors.message ? "border-destructive" : ""}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive">{errors.message}</p>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="ri-send-plane-line mr-2"></i>
                        Submit Request
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* FAQ and Contact Info */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <i className="ri-phone-line text-lg text-primary mr-3 mt-0.5"></i>
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">+1 (800) 123-4567</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Mon-Fri, 9AM-6PM EST</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <i className="ri-mail-line text-lg text-primary mr-3 mt-0.5"></i>
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">support@hotelmanagement.com</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">24/7 response within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <i className="ri-map-pin-line text-lg text-primary mr-3 mt-0.5"></i>
                <div>
                  <p className="font-medium">Main Office</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    123 Hotel Street, Suite 456<br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}