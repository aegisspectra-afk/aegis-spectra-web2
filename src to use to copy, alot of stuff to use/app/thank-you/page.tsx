import Link from 'next/link';
import { CheckCircle, ArrowRight, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-aegis-teal/5 via-background to-aegis-graphite/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-aegis-graphite">
            Thank You!
          </CardTitle>
          <CardDescription className="text-lg">
            Your message has been received successfully
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center text-muted-foreground">
            <p className="mb-4">
              We've received your inquiry and our team will get back to you within 24 hours.
            </p>
            <p>
              In the meantime, feel free to explore our platform or contact us directly.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-aegis-teal/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-aegis-teal" />
                  <div>
                    <p className="font-medium">Email Us</p>
                    <p className="text-sm text-muted-foreground">
                      admin@aegis-spectra.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-aegis-teal/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-aegis-teal" />
                  <div>
                    <p className="font-medium">Call Us</p>
                    <p className="text-sm text-muted-foreground">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="aegis" size="lg">
              <Link href="/">
                <ArrowRight className="mr-2 h-4 w-4" />
                Back to Homepage
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">
                View Pricing Plans
              </Link>
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Reference ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}