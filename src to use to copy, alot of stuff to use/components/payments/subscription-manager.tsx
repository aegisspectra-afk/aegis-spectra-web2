'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  AlertCircle,
  CheckCircle,
  Loader2,
  ExternalLink,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface SubscriptionData {
  id: string;
  plan: string;
  status: string;
  startDate: string;
  endDate?: string;
  amount: number;
  currency: string;
  provider: string;
  nextBillingDate?: string;
}

export function SubscriptionManager() {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchSubscription();
    }
  }, [session]);

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/subscriptions/current');
      
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
      toast.error('Failed to load subscription data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    if (!confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
      return;
    }

    try {
      setIsUpdating(true);
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscription.id,
        }),
      });

      if (response.ok) {
        toast.success('Subscription cancelled successfully');
        await fetchSubscription();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to cancel subscription');
      }
    } catch (error: any) {
      toast.error('Failed to cancel subscription', {
        description: error.message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePaymentMethod = async () => {
    try {
      // Redirect to PayPal for payment method updates
      window.open('https://www.paypal.com/myaccount/autopay', '_blank');
    } catch (error: any) {
      toast.error('Failed to open payment portal', {
        description: error.message,
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'default';
      case 'past_due':
        return 'destructive';
      case 'canceled':
        return 'secondary';
      case 'trialing':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'past_due':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'canceled':
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      case 'trialing':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100); // Assuming amount is in cents
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-aegis-blue" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            No Active Subscription
          </CardTitle>
          <CardDescription>
            You don't have an active subscription. Choose a plan to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="aegis">
            <a href="/pricing">View Plans</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Subscription
          </CardTitle>
          <CardDescription>
            Manage your subscription and billing information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Plan</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {subscription.plan}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(subscription.status)}
                  <Badge variant={getStatusBadgeVariant(subscription.status)}>
                    {subscription.status}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Provider</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">
                    {subscription.provider.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                <div className="flex items-center gap-2 mt-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-lg font-semibold">
                    {formatCurrency(subscription.amount, subscription.currency)}
                  </span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Started</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(subscription.startDate)}</span>
                </div>
              </div>

              {subscription.nextBillingDate && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Next Billing</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(subscription.nextBillingDate)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleUpdatePaymentMethod}
              variant="outline"
              disabled={isUpdating}
            >
              <Settings className="h-4 w-4 mr-2" />
              Update Payment Method
            </Button>

            <Button
              onClick={handleCancelSubscription}
              variant="destructive"
              disabled={isUpdating || subscription.status === 'canceled'}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Cancel Subscription'
              )}
            </Button>

            <Button asChild variant="outline">
              <a href="/pricing" target="_blank">
                <ExternalLink className="h-4 w-4 mr-2" />
                Change Plan
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            View your past invoices and payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Billing history will be available here</p>
            <p className="text-sm">This feature is coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}