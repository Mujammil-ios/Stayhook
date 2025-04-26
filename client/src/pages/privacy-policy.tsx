import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Privacy Policy</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
        <Button variant="outline" size="sm" asChild className="self-start">
          <Link href="/" className="flex items-center">
            <i className="ri-arrow-left-line mr-2 text-lg"></i>
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card className="glass mb-6">
        <CardHeader>
          <CardTitle>Introduction</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            HotelHub Management System ("we", "our", or "us") is committed to
            protecting your privacy. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you use our hotel
            management system.
          </p>
          <p>
            Please read this Privacy Policy carefully. By accessing or using our
            system, you acknowledge that you have read, understood, and agree to
            be bound by all the terms outlined in this Privacy Policy.
          </p>
        </CardContent>
      </Card>

      <Card className="glass mb-6">
        <CardHeader>
          <CardTitle>Information We Collect</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h3>Personal Information</h3>
          <p>
            We may collect personal identification information from users in
            various ways, including, but not limited to, when users visit our
            system, register, place a booking, subscribe to the newsletter, and
            in connection with other activities, services, features, or resources
            we make available in our system. Users may be asked for, as
            appropriate, name, email address, phone number, credit card
            information, and other relevant details.
          </p>

          <h3>Non-Personal Information</h3>
          <p>
            We may collect non-personal identification information about users
            whenever they interact with our system. Non-personal identification
            information may include the browser name, the type of computer,
            technical information about users' means of connection to our system,
            such as the operating system, and other similar information.
          </p>
        </CardContent>
      </Card>

      <Card className="glass mb-6">
        <CardHeader>
          <CardTitle>How We Use Your Information</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>We may use the information we collect from you to:</p>
          <ul>
            <li>Personalize user experience</li>
            <li>Process payments and bookings</li>
            <li>Improve our system and services</li>
            <li>
              Send periodic emails regarding bookings, updates, or other
              information
            </li>
            <li>Respond to customer service requests</li>
            <li>Administer promotions, surveys, or other site features</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="glass mb-6">
        <CardHeader>
          <CardTitle>Data Security</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            We implement appropriate data collection, storage, processing
            practices, and security measures to protect against unauthorized
            access, alteration, disclosure, or destruction of your personal
            information, username, password, transaction information, and data
            stored in our system.
          </p>
          <p>
            The exchange of sensitive and private data between the system and its
            users happens over an SSL-secured communication channel and is
            encrypted and protected with digital signatures.
          </p>
        </CardContent>
      </Card>

      <Card className="glass mb-6">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at:
          </p>
          <p className="font-medium">
            Email: support@hotelhub.com
            <br />
            Phone: +1 (555) 123-4567
            <br />
            Address: 123 Hotel Street, Suite 101, City, State, ZIP
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-center md:justify-start mb-10">
        <Button asChild>
          <Link href="/terms-and-conditions" className="flex items-center">
            View Terms & Conditions
            <i className="ri-arrow-right-line ml-2 text-lg"></i>
          </Link>
        </Button>
      </div>
    </div>
  );
}