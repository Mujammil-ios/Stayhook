import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsAndConditions() {
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Terms & Conditions</h1>
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
          <CardTitle>Acceptance of Terms</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            By accessing or using HotelHub Management System ("System"), you agree to comply with and be bound by the 
            following terms and conditions of use. If you do not agree to these terms, please do not use our System.
          </p>
          <p>
            The terms "HotelHub," "we," "us," or "our" refer to the owner of the System. The term "you" refers to the 
            user or viewer of our System.
          </p>
        </CardContent>
      </Card>

      <Card className="glass mb-6">
        <CardHeader>
          <CardTitle>Use License</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            Permission is granted to temporarily use this software System for personal, non-commercial, or commercial 
            hospitality management purposes only. This is the grant of a license, not a transfer of title, and under 
            this license, you may not:
          </p>
          <ul>
            <li>Modify or copy the materials;</li>
            <li>Use the materials for any commercial purpose outside of hospitality management;</li>
            <li>Attempt to decompile or reverse engineer any software contained on the System;</li>
            <li>Remove any copyright or other proprietary notations from the materials; or</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
          </ul>
          <p>
            This license shall automatically terminate if you violate any of these restrictions and may be terminated 
            by HotelHub at any time. Upon terminating your viewing of these materials or upon the termination of this 
            license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
          </p>
        </CardContent>
      </Card>

      <Card className="glass mb-6">
        <CardHeader>
          <CardTitle>Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            The materials on HotelHub's System are provided on an 'as is' basis. HotelHub makes no warranties, expressed 
            or implied, and hereby disclaims and negates all other warranties including, without limitation, implied 
            warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of 
            intellectual property or other violation of rights.
          </p>
          <p>
            Further, HotelHub does not warrant or make any representations concerning the accuracy, likely results, or 
            reliability of the use of the materials on its System or otherwise relating to such materials or on any 
            sites linked to this System.
          </p>
        </CardContent>
      </Card>

      <Card className="glass mb-6">
        <CardHeader>
          <CardTitle>Limitations</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            In no event shall HotelHub or its suppliers be liable for any damages (including, without limitation, 
            damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
            to use the materials on HotelHub's System, even if HotelHub or a HotelHub authorized representative has 
            been notified orally or in writing of the possibility of such damage.
          </p>
          <p>
            Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for 
            consequential or incidental damages, these limitations may not apply to you.
          </p>
        </CardContent>
      </Card>

      <Card className="glass mb-6">
        <CardHeader>
          <CardTitle>Revisions and Errata</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            The materials appearing on HotelHub's System could include technical, typographical, or photographic errors. 
            HotelHub does not warrant that any of the materials on its System are accurate, complete, or current. 
            HotelHub may make changes to the materials contained on its System at any time without notice. 
            HotelHub does not, however, make any commitment to update the materials.
          </p>
        </CardContent>
      </Card>

      <Card className="glass mb-6">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            If you have any questions about these Terms and Conditions, please contact us at:
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
          <Link href="/privacy-policy" className="flex items-center">
            View Privacy Policy
            <i className="ri-arrow-right-line ml-2 text-lg"></i>
          </Link>
        </Button>
      </div>
    </div>
  );
}