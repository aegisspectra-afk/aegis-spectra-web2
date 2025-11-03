import { Button } from '@/components/ui/button';
import { Search, BookOpen, Users, Shield } from 'lucide-react';
import Link from 'next/link';

export function BlogHero() {
  return (
    <div className="bg-gradient-to-br from-aegis-teal/5 via-background to-aegis-graphite/5 py-20" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
            <span className="gradient-text">מדריכי אבטחה</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            הישאר מעודכן עם טיפים מקצועיים, מדריכי התקנה, 
            ועצות מומחים מצוות Aegis Spectra.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-aegis-secondary" />
              <input
                type="text"
                placeholder="חפש במדריכים..."
                className="w-full px-4 py-3 pr-10 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-aegis-teal/50 focus:border-aegis-teal"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-aegis-teal mb-2">25+</div>
              <div className="text-sm text-muted-foreground">מדריכים מקצועיים</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-aegis-teal mb-2">500+</div>
              <div className="text-sm text-muted-foreground">קוראים חודשיים</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-aegis-teal mb-2">100%</div>
              <div className="text-sm text-muted-foreground">אחוזי הצלחה בהתקנות</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}