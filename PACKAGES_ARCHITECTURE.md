# ארכיטקטורת מערכת החבילות - מסמך מלא

## תוכן עניינים
1. [סקירה כללית](#סקירה-כללית)
2. [עקרונות יסוד](#עקרונות-יסוד)
3. [מבנה קבצים](#מבנה-קבצים)
4. [טיפוסים (TypeScript)](#טיפוסים-typescript)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Price Engine](#price-engine)
8. [Quote Builder Flow](#quote-builder-flow)
9. [Admin Panel](#admin-panel)
10. [CRM Integration](#crm-integration)
11. [Analytics & Logging](#analytics--logging)
12. [Versioning & Rollback](#versioning--rollback)
13. [Security](#security)
14. [Testing Strategy](#testing-strategy)
15. [CI/CD & Deployment](#cicd--deployment)
16. [Roadmap & Priorities](#roadmap--priorities)

---

## סקירה כללית

מערכת חבילות מותאמות מלאה עם:
- **Frontend**: Next.js 14 + React + TypeScript
- **Backend**: REST API (Node.js/Next.js API Routes)
- **Database**: PostgreSQL/Neon (JSON support)
- **Features**: Dynamic pricing, quote builder, cart, admin, CRM integration, analytics

---

## עקרונות יסוד

### 1. Single Source of Truth
- כל חבילה נשמרת במקום אחד: `/api/packages` או `frontend/src/data/packages.ts` (sync עם DB)
- מחירים מחושבים בצד שרת בלבד (authoritative)
- Quotes מכילים snapshot של החבילה בזמן יצירה (למניעת שינויי מחיר)

### 2. Separation of Concerns
```
Types → Components → Services → API → Database
```

### 3. Event-Driven Architecture
- כל פעולה מרכזית יוזמת event ל-analytics
- Events: `package_view`, `price_calc`, `add_to_cart`, `quote_submit`, `quote_share`

### 4. Safe Defaults
- Validation בצד לקוח (UX)
- Validation מחמירה בצד שרת (Security)
- מחירים, טווחים, תוספות - כל מאומת

---

## מבנה קבצים

### Frontend Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx                          # Homepage (4 packages)
│   │   ├── packages/
│   │   │   ├── page.tsx                      # All packages (search/filter)
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx                  # Package detail
│   │   │   └── compare/
│   │   │       └── page.tsx                  # Compare packages
│   │   ├── quote/
│   │   │   └── page.tsx                      # Quote Builder
│   │   └── admin/
│   │       ├── packages/
│   │       │   ├── page.tsx                  # Packages list
│   │       │   ├── [id]/
│   │       │   │   └── page.tsx              # Edit package
│   │       │   └── versions/
│   │       │       └── [id].tsx              # Version history
│   │       ├── quotes/
│   │       │   └── page.tsx                  # Quotes management
│   │       └── analytics/
│   │           └── page.tsx                  # Analytics dashboard
│   │
│   ├── components/
│   │   ├── packages/
│   │   │   ├── PackageHero.tsx              # Hero section
│   │   │   ├── PackageFeatures.tsx          # Features list
│   │   │   ├── PackageSpecs.tsx              # Specifications table
│   │   │   ├── PackageAddons.tsx             # Addons picker
│   │   │   ├── PackageCalculator.tsx        # Price calculator
│   │   │   └── PackageGallery.tsx            # Image gallery
│   │   ├── quote/
│   │   │   ├── QuoteBuilder.tsx              # Main builder component
│   │   │   ├── QuoteStep1.tsx               # Step 1: Property details
│   │   │   ├── QuoteStep2.tsx               # Step 2: Package selection
│   │   │   ├── QuoteStep3.tsx               # Step 3: Customization
│   │   │   ├── QuoteStep4.tsx               # Step 4: Summary
│   │   │   └── QuoteSummaryDrawer.tsx      # Price breakdown drawer
│   │   └── admin/
│   │       ├── PackageForm.tsx              # Create/Edit form
│   │       ├── VersionHistory.tsx           # Version timeline
│   │       └── QuoteTable.tsx               # Quotes table
│   │
│   ├── services/
│   │   ├── packages/
│   │   │   ├── price.ts                     # calculatePackagePrice()
│   │   │   ├── api.ts                       # API wrapper (fetch packages)
│   │   │   └── validation.ts                # Validation helpers
│   │   ├── quotes/
│   │   │   ├── api.ts                       # Quote API calls
│   │   │   ├── draft.ts                     # Draft management (localStorage)
│   │   │   └── pdf.ts                       # PDF generation request
│   │   └── analytics/
│   │       └── events.ts                    # Track events
│   │
│   ├── data/
│   │   └── packages.ts                     # Initial seed data
│   │
│   ├── types/
│   │   ├── packages.ts                      # Package types
│   │   ├── quotes.ts                        # Quote types
│   │   └── api.ts                           # API response types
│   │
│   └── contexts/
│       ├── cart-context.tsx                # Cart state
│       └── quote-context.tsx               # Quote builder state
│
└── public/
    └── images/
        └── packages/
            ├── [slug]-hero.jpg
            ├── [slug]-equipment.jpg
            └── [slug]-installation.jpg
```

### Backend Structure (API Routes)
```
frontend/src/app/api/
├── packages/
│   ├── route.ts                            # GET: list, POST: create
│   ├── [slug]/
│   │   └── route.ts                       # GET: detail, PUT: update
│   └── [id]/
│       ├── versions/
│       │   └── route.ts                   # GET: version history
│       └── rollback/
│           └── route.ts                   # POST: rollback to version
│
├── price/
│   └── calc/
│       └── route.ts                       # POST: calculate price
│
├── quotes/
│   ├── route.ts                           # GET: list, POST: create
│   ├── [id]/
│   │   ├── route.ts                       # GET: detail, PUT: update
│   │   ├── pdf/
│   │   │   └── route.ts                   # GET: generate PDF
│   │   └── share/
│   │       └── [token]/
│   │           └── route.ts               # GET: share preview
│   └── draft/
│       └── route.ts                       # POST: save draft
│
├── cart/
│   ├── route.ts                           # GET: get cart
│   ├── add/
│   │   └── route.ts                       # POST: add item
│   └── checkout/
│       └── route.ts                       # POST: checkout
│
├── analytics/
│   └── events/
│       └── route.ts                       # POST: track event
│
└── admin/
    ├── packages/
    │   └── route.ts                       # Admin: packages CRUD
    ├── quotes/
    │   └── route.ts                       # Admin: quotes list
    └── analytics/
        └── dashboard/
            └── route.ts                  # Admin: analytics data
```

---

## טיפוסים (TypeScript)

### `frontend/src/types/packages.ts`

```typescript
export type PackageCategory = 'Residential' | 'Commercial' | 'Enterprise';

export type PackageSlug = 
  | 'apartment-basic' | 'apartment-pro'
  | 'house-essential' | 'house-pro'
  | 'business-starter' | 'business-professional'
  | 'business-enterprise' | 'enterprise-suite';

export type AIDetectionLevel = 'basic' | 'advanced' | 'enterprise';
export type CameraType = 'IP' | '4MP' | '4K' | 'Color Night' | 'AI';
export type StorageType = 'HDD' | 'SSD' | 'Hybrid';
export type SupportLevel = 'basic' | 'professional' | 'enterprise';

export interface PackageFeature {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface PackageSpecification {
  cameras: {
    min: number;
    max: number;
    default: number;
    types: CameraType[];
  };
  nvr: {
    channels: number;
    type: string;
    model?: string;
  };
  storage: {
    size: string; // "1TB", "2TB"
    type: StorageType;
    recordingTime?: string; // "30 days"
  };
  aiDetection?: {
    level: AIDetectionLevel;
    features: string[];
  };
  app: {
    platforms: ('iOS' | 'Android' | 'Web')[];
    language: string;
    features: string[];
  };
  ups?: {
    included: boolean;
    model?: string;
  };
  accessControl?: {
    included: boolean;
    type?: string;
  };
  alarm?: {
    included: boolean;
    type?: string;
  };
  support: {
    level: SupportLevel;
    responseTime?: string;
    features: string[];
  };
  warranty: {
    months: number;
    coverage: string[];
  };
}

export interface DiscountRule {
  type: 'bulk' | 'promo' | 'seasonal';
  condition: {
    cameras?: number;
    storage?: string;
    dateRange?: { from: string; to: string };
  };
  discount: number; // percentage
  description: string;
}

export interface PackagePricing {
  base: number;
  currency: 'ILS';
  installation: {
    included: boolean;
    price?: number;
  };
  additionalCameras?: {
    pricePerCamera: number;
    max?: number;
  };
  upgrades?: {
    ai: {
      basic: number;
      advanced: number;
      enterprise: number;
    };
    storage?: Record<string, number>; // "2TB": 500
  };
  addons?: PackageAddon[];
  maintenance?: {
    annual: number;
    optional: boolean;
  };
  discountRules?: DiscountRule[];
}

export interface PackageAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'hardware' | 'service' | 'upgrade';
  optional: boolean;
}

export interface Package {
  id: string;
  slug: PackageSlug;
  name: string;
  nameHebrew: string;
  category: PackageCategory;
  type: 'apartment' | 'house' | 'business' | 'enterprise';
  description: string;
  shortDescription: string;
  priceRange: string;
  pricing: PackagePricing;
  specifications: PackageSpecification;
  features: PackageFeature[];
  image?: string;
  heroImage?: string;
  equipmentImages?: string[];
  popular?: boolean;
  recommended?: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}
```

### `frontend/src/types/quotes.ts`

```typescript
export interface QuoteOptions {
  cameras?: number;
  aiDetection?: 'basic' | 'advanced' | 'enterprise';
  storage?: string;
  addons?: string[];
  installationIncluded?: boolean;
  maintenance?: boolean;
}

export interface QuotePriceBreakdown {
  base: number;
  additionalCameras: number;
  aiUpgrade: number;
  storageUpgrade: number;
  addons: number;
  installation: number;
  maintenance: number;
  subtotal: number;
  discounts: number;
  tax?: number;
  total: number;
  currency: 'ILS';
}

export interface Quote {
  id: string;
  userId?: string;
  packageSnapshot: Package; // Snapshot at creation time
  options: QuoteOptions;
  priceBreakdown: QuotePriceBreakdown;
  contact: {
    name: string;
    phone: string;
    email?: string;
    location: string;
  };
  propertyDetails: {
    size?: string;
    specialRequirements?: string;
    budget?: string;
  };
  status: 'draft' | 'created' | 'sent_to_crm' | 'accepted' | 'rejected' | 'expired';
  shareToken?: string;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## Database Schema

### SQL Tables (PostgreSQL/Neon)

```sql
-- Packages table
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  name_hebrew VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'Residential', 'Commercial', 'Enterprise'
  type VARCHAR(50) NOT NULL, -- 'apartment', 'house', 'business', 'enterprise'
  description TEXT,
  short_description TEXT,
  price_range VARCHAR(50),
  specs JSONB NOT NULL, -- PackageSpecification
  pricing JSONB NOT NULL, -- PackagePricing
  features JSONB NOT NULL, -- PackageFeature[]
  images JSONB, -- string[]
  seo JSONB, -- SEO metadata
  popular BOOLEAN DEFAULT false,
  recommended BOOLEAN DEFAULT false,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_packages_category ON packages(category);
CREATE INDEX idx_packages_slug ON packages(slug);
CREATE INDEX idx_packages_popular ON packages(popular);

-- Package versions (for rollback)
CREATE TABLE package_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  data JSONB NOT NULL, -- Full package snapshot
  changed_by UUID, -- Admin user ID
  changes_summary TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_package_versions_package_id ON package_versions(package_id);

-- Quotes table
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- Nullable for anonymous quotes
  package_snapshot JSONB NOT NULL, -- Package at creation time
  options JSONB NOT NULL, -- QuoteOptions
  price_breakdown JSONB NOT NULL, -- QuotePriceBreakdown
  contact JSONB NOT NULL, -- {name, phone, email, location}
  property_details JSONB, -- {size, specialRequirements, budget}
  status VARCHAR(50) DEFAULT 'created', -- 'draft', 'created', 'sent_to_crm', etc.
  share_token VARCHAR(100) UNIQUE,
  pdf_url TEXT,
  crm_sync_status VARCHAR(50), -- 'pending', 'sent', 'failed'
  crm_sync_error TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_quotes_user_id ON quotes(user_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_share_token ON quotes(share_token);

-- Carts table
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- Nullable for guest carts
  session_id VARCHAR(200), -- For guest tracking
  items JSONB NOT NULL, -- CartItem[]
  total_price DECIMAL(10, 2),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_carts_session_id ON carts(session_id);

-- Analytics events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL, -- 'package_view', 'price_calc', etc.
  user_id UUID,
  session_id VARCHAR(200),
  package_slug VARCHAR(100),
  payload JSONB, -- Event-specific data
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_package_slug ON analytics_events(package_slug);

-- Promotions/Coupons
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'percent', 'fixed'
  value DECIMAL(10, 2) NOT NULL,
  valid_from TIMESTAMP,
  valid_to TIMESTAMP,
  applicable_package_slugs JSONB, -- string[] or null for all
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_promotions_code ON promotions(code);
CREATE INDEX idx_promotions_enabled ON promotions(enabled);
```

---

## API Endpoints

### Packages API

#### `GET /api/packages`
**Query Parameters:**
- `category`: 'Residential' | 'Commercial' | 'Enterprise'
- `search`: string
- `popular`: boolean
- `sort`: 'price-low' | 'price-high' | 'popular' | 'new'

**Response:**
```json
{
  "success": true,
  "data": Package[],
  "total": number,
  "filters": {
    "category": string,
    "search": string,
    "sort": string
  }
}
```

#### `GET /api/packages/[slug]`
**Response:**
```json
{
  "success": true,
  "data": Package
}
```

#### `POST /api/packages` (Admin)
**Body:**
```json
{
  "slug": string,
  "name": string,
  "nameHebrew": string,
  "category": string,
  "specs": PackageSpecification,
  "pricing": PackagePricing,
  ...
}
```

**Response:**
```json
{
  "success": true,
  "data": Package,
  "version": number
}
```

#### `PUT /api/packages/[id]` (Admin)
**Body:** Same as POST
**Response:** Updated package + new version entry

#### `GET /api/packages/[id]/versions` (Admin)
**Response:**
```json
{
  "success": true,
  "data": PackageVersion[]
}
```

#### `POST /api/packages/[id]/rollback/[version]` (Admin)
**Response:**
```json
{
  "success": true,
  "data": Package
}
```

---

### Price Calculation API

#### `POST /api/price/calc`
**Body:**
```json
{
  "packageId": string, // or packageSlug
  "options": {
    "cameras": number,
    "aiDetection": "basic" | "advanced" | "enterprise",
    "storage": string, // "2TB"
    "addons": string[], // addon IDs
    "installationIncluded": boolean,
    "maintenance": boolean
  },
  "promoCode": string, // optional
  "userContext": {
    "country": "IL",
    "vatIncluded": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "breakdown": [
    {
      "label": "מחיר בסיס",
      "amount": 4500
    },
    {
      "label": "מצלמות נוספות (2 x 200)",
      "amount": 400
    },
    {
      "label": "AI Advanced",
      "amount": 1200
    }
  ],
  "subtotal": 6100,
  "discounts": [
    {
      "label": "Bulk discount",
      "amount": -305
    }
  ],
  "tax": 1156.75,
  "total": 6951.75,
  "currency": "ILS",
  "validated": true
}
```

**Validation:**
- Verify cameras within min/max range
- Verify addons exist and are valid
- Verify storage upgrade is available
- Apply discount rules server-side
- Return authoritative price

---

### Quotes API

#### `POST /api/quotes`
**Body:**
```json
{
  "packageSlug": string,
  "packageSnapshot": Package, // Full snapshot
  "options": QuoteOptions,
  "contact": {
    "name": string,
    "phone": string,
    "email": string,
    "location": string
  },
  "propertyDetails": {
    "size": string,
    "specialRequirements": string,
    "budget": string
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": string,
    "quoteId": string,
    "status": "created",
    "pdfUrl": string,
    "shareToken": string
  }
}
```

**Flow:**
1. Validate package snapshot
2. Re-calculate price server-side (authoritative)
3. Create quote record
4. Queue job: `sendQuoteToCRM` + `generatePDF`
5. Return quote ID

#### `GET /api/quotes/[id]`
**Response:**
```json
{
  "success": true,
  "data": Quote
}
```

#### `GET /api/quotes/[id]/pdf`
**Response:** PDF file (application/pdf)

#### `GET /api/quotes/[id]/share/[token]`
**Response:** Public preview (read-only, no auth required)

#### `POST /api/quotes/draft`
**Body:**
```json
{
  "packageSlug": string,
  "options": QuoteOptions,
  "propertyDetails": object
}
```

**Response:**
```json
{
  "success": true,
  "draftId": string
}
```

---

### Cart API

#### `POST /api/cart/add`
**Body:**
```json
{
  "item": {
    "sku": string,
    "name": string,
    "price": number,
    "quantity": number,
    "type": "product" | "package",
    "packageSlug": string,
    "packageOptions": QuoteOptions
  }
}
```

#### `GET /api/cart`
**Response:**
```json
{
  "success": true,
  "data": {
    "items": CartItem[],
    "total": number
  }
}
```

#### `POST /api/cart/checkout`
**Body:**
```json
{
  "contact": object,
  "paymentMethod": string
}
```

**Response:**
```json
{
  "success": true,
  "orderId": string,
  "quoteId": string
}
```

---

### Analytics API

#### `POST /api/analytics/events`
**Body:**
```json
{
  "eventType": "package_view" | "price_calc" | "add_to_cart" | "quote_submit",
  "packageSlug": string,
  "payload": object
}
```

**Response:**
```json
{
  "success": true
}
```

#### `GET /api/admin/analytics/dashboard`
**Query Parameters:**
- `from`: date
- `to`: date
- `eventType`: string

**Response:**
```json
{
  "success": true,
  "data": {
    "funnel": {
      "visits": number,
      "builderStarts": number,
      "quotesSubmitted": number,
      "conversions": number
    },
    "topPackages": Array<{
      "slug": string,
      "views": number,
      "quotes": number
    }>,
    "recentEvents": Event[]
  }
}
```

---

## Price Engine

### Implementation: `frontend/src/services/packages/price.ts`

```typescript
import { Package, PackagePriceOptions } from '@/types/packages';
import { QuotePriceBreakdown } from '@/types/quotes';

export function calculatePackagePrice(
  packageData: Package,
  options: PackagePriceOptions,
  promoCode?: string
): QuotePriceBreakdown {
  // 1. Validate inputs
  validateOptions(packageData, options);

  // 2. Start with base price
  let breakdown: QuotePriceBreakdown = {
    base: packageData.pricing.base,
    additionalCameras: 0,
    aiUpgrade: 0,
    storageUpgrade: 0,
    addons: 0,
    installation: 0,
    maintenance: 0,
    subtotal: 0,
    discounts: 0,
    total: 0,
    currency: 'ILS',
  };

  // 3. Calculate additional cameras
  if (options.cameras && packageData.pricing.additionalCameras) {
    const defaultCameras = packageData.specifications.cameras.default;
    const additionalCount = Math.max(0, options.cameras - defaultCameras);
    const maxAdditional = packageData.pricing.additionalCameras.max || Infinity;
    const actualAdditional = Math.min(additionalCount, maxAdditional);
    breakdown.additionalCameras = actualAdditional * packageData.pricing.additionalCameras.pricePerCamera;
  }

  // 4. Calculate AI upgrade
  if (options.aiDetection && packageData.pricing.upgrades?.ai) {
    const aiUpgrades = packageData.pricing.upgrades.ai;
    const defaultAI = packageData.specifications.aiDetection?.level || 'basic';
    
    if (options.aiDetection === 'advanced' && defaultAI === 'basic') {
      breakdown.aiUpgrade = aiUpgrades.advanced - (aiUpgrades.basic || 0);
    } else if (options.aiDetection === 'enterprise') {
      breakdown.aiUpgrade = aiUpgrades.enterprise - (aiUpgrades[defaultAI] || 0);
    }
  }

  // 5. Calculate storage upgrade
  if (options.storage && packageData.pricing.upgrades?.storage) {
    breakdown.storageUpgrade = packageData.pricing.upgrades.storage[options.storage] || 0;
  }

  // 6. Calculate addons
  if (options.addons && packageData.pricing.addons) {
    breakdown.addons = packageData.pricing.addons
      .filter((addon) => options.addons?.includes(addon.id))
      .reduce((sum, addon) => sum + addon.price, 0);
  }

  // 7. Calculate installation
  if (!packageData.pricing.installation.included || !options.installationIncluded) {
    breakdown.installation = packageData.pricing.installation.price || 0;
  }

  // 8. Calculate maintenance
  if (options.maintenance && packageData.pricing.maintenance) {
    breakdown.maintenance = packageData.pricing.maintenance.annual;
  }

  // 9. Calculate subtotal
  breakdown.subtotal =
    breakdown.base +
    breakdown.additionalCameras +
    breakdown.aiUpgrade +
    breakdown.storageUpgrade +
    breakdown.addons +
    breakdown.installation +
    breakdown.maintenance;

  // 10. Apply discount rules
  if (packageData.pricing.discountRules) {
    for (const rule of packageData.pricing.discountRules) {
      if (evaluateDiscountRule(rule, options)) {
        const discountAmount = (breakdown.subtotal * rule.discount) / 100;
        breakdown.discounts += discountAmount;
      }
    }
  }

  // 11. Apply promo code
  if (promoCode) {
    const promoDiscount = await validatePromoCode(promoCode, packageData.slug);
    if (promoDiscount) {
      breakdown.discounts += promoDiscount;
    }
  }

  // 12. Calculate tax (if applicable)
  breakdown.tax = calculateTax(breakdown.subtotal - breakdown.discounts);

  // 13. Calculate total
  breakdown.total = Math.max(0, breakdown.subtotal - breakdown.discounts + (breakdown.tax || 0));

  return breakdown;
}

function validateOptions(packageData: Package, options: PackagePriceOptions): void {
  // Validate cameras range
  if (options.cameras) {
    const { min, max } = packageData.specifications.cameras;
    if (options.cameras < min || options.cameras > max) {
      throw new Error(`Cameras must be between ${min} and ${max}`);
    }
  }

  // Validate addons exist
  if (options.addons && packageData.pricing.addons) {
    const validAddonIds = packageData.pricing.addons.map(a => a.id);
    const invalidAddons = options.addons.filter(id => !validAddonIds.includes(id));
    if (invalidAddons.length > 0) {
      throw new Error(`Invalid addons: ${invalidAddons.join(', ')}`);
    }
  }
}

function evaluateDiscountRule(rule: DiscountRule, options: PackagePriceOptions): boolean {
  if (rule.type === 'bulk') {
    if (rule.condition.cameras && options.cameras) {
      return options.cameras > rule.condition.cameras;
    }
    if (rule.condition.storage && options.storage) {
      return options.storage >= rule.condition.storage;
    }
  }
  // Add more rule types
  return false;
}
```

### Server-Side Implementation: `frontend/src/app/api/price/calc/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { calculatePackagePrice } from '@/services/packages/price';
import { getPackageBySlug } from '@/data/packages';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packageId, packageSlug, options, promoCode } = body;

    // Get package
    const packageData = packageSlug 
      ? getPackageBySlug(packageSlug)
      : await getPackageById(packageId);

    if (!packageData) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      );
    }

    // Calculate price (authoritative)
    const breakdown = calculatePackagePrice(packageData, options, promoCode);

    // Log analytics event
    await trackEvent('price_calc', {
      packageSlug: packageData.slug,
      options,
      total: breakdown.total,
    });

    return NextResponse.json({
      success: true,
      breakdown: formatBreakdown(breakdown),
      subtotal: breakdown.subtotal,
      discounts: breakdown.discounts,
      tax: breakdown.tax,
      total: breakdown.total,
      currency: breakdown.currency,
      validated: true,
    });
  } catch (error) {
    console.error('Price calculation error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
```

---

## Quote Builder Flow

### Flow Diagram
```
User visits /quote
  ↓
Step 1: Property Details (size, location, requirements)
  ↓
Step 2: Package Selection (or from /packages/[slug])
  ↓
Step 3: Customization (cameras, AI, storage, addons)
  ↓
  └─→ Real-time price calc (debounced, 300ms)
  └─→ Autosave draft (every 30s)
  ↓
Step 4: Summary + Price Breakdown
  ↓
  ├─→ "Save Draft" → localStorage + API
  ├─→ "Share" → Generate share token
  ├─→ "Add to Cart" → Add to cart context
  └─→ "Submit Quote" → POST /api/quotes
        ↓
        Server validates + creates quote
        ↓
        Queue: sendQuoteToCRM + generatePDF
        ↓
        Return quoteId + pdfUrl
```

### Key Components

#### `QuoteBuilder.tsx` (Main Container)
```typescript
export function QuoteBuilder() {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [options, setOptions] = useState<QuoteOptions>({});
  const [priceBreakdown, setPriceBreakdown] = useState<QuotePriceBreakdown | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedPackage && options) {
        saveDraft(selectedPackage, options);
      }
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [selectedPackage, options]);

  // Real-time price calculation
  useEffect(() => {
    if (!selectedPackage) return;

    const timer = setTimeout(async () => {
      const response = await fetch('/api/price/calc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageSlug: selectedPackage.slug,
          options,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setPriceBreakdown(data);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(timer);
  }, [selectedPackage, options]);

  // Load draft on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setSelectedPackage(draft.package);
      setOptions(draft.options);
      setDraftId(draft.id);
    }
  }, []);

  return (
    <div>
      <ProgressIndicator step={step} />
      {step === 1 && <QuoteStep1 onNext={handleNext} />}
      {step === 2 && <QuoteStep2 onNext={handleNext} />}
      {step === 3 && <QuoteStep3 onNext={handleNext} />}
      {step === 4 && <QuoteStep4 onSubmit={handleSubmit} />}
      <QuoteSummaryDrawer breakdown={priceBreakdown} />
    </div>
  );
}
```

---

## Admin Panel

### Modules

#### 1. Packages Manager
- **List**: `/admin/packages` - Table with search, filters
- **Create**: `/admin/packages/new` - Form with all fields
- **Edit**: `/admin/packages/[id]` - Pre-filled form
- **Version History**: `/admin/packages/[id]/versions` - Timeline view
- **Rollback**: Button in version history → POST `/api/packages/[id]/rollback/[version]`

#### 2. Quotes Manager
- **List**: `/admin/quotes` - Table with status, filters
- **Detail**: View full quote snapshot, price breakdown
- **Actions**: 
  - Send to CRM (manual trigger)
  - Generate PDF
  - Export to CSV

#### 3. Analytics Dashboard
- **Funnel**: Visits → Builder → Quotes → Conversions
- **Top Packages**: Views & Quote counts
- **Real-time Events**: Last 24h stream
- **Charts**: Revenue, conversion rates

#### 4. Promotions Manager
- **List**: All active/inactive promotions
- **Create/Edit**: Form with dates, conditions
- **Usage Stats**: Per promotion

---

## CRM Integration

### Flow

```
Quote Created → Queue Job
  ↓
POST /api/integrations/crm/sendQuote
  ↓
Validate payload
  ↓
HTTP POST to CRM webhook
  ↓
  ├─→ Success (200) → Update quote.status = 'sent_to_crm'
  └─→ Failure → Retry (exponential backoff, max 3 retries)
         ↓
         Still failed → Log error + update quote.crm_sync_error
```

### Implementation: `frontend/src/app/api/integrations/crm/sendQuote/route.ts`

```typescript
export async function POST(request: NextRequest) {
  const { quoteId } = await request.json();
  
  // Get quote
  const quote = await getQuoteById(quoteId);
  
  // Prepare CRM payload
  const payload = {
    quoteId: quote.id,
    customer: quote.contact,
    package: quote.packageSnapshot.nameHebrew,
    total: quote.priceBreakdown.total,
    items: formatQuoteItems(quote),
    pdfUrl: quote.pdfUrl,
    createdAt: quote.createdAt,
  };

  // Send to CRM
  try {
    const response = await fetch(process.env.CRM_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CRM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      await updateQuote(quoteId, {
        status: 'sent_to_crm',
        crm_sync_status: 'sent',
      });
      return NextResponse.json({ success: true });
    } else {
      throw new Error(`CRM returned ${response.status}`);
    }
  } catch (error) {
    // Retry logic
    await updateQuote(quoteId, {
      crm_sync_status: 'failed',
      crm_sync_error: error.message,
    });
    // Queue retry job
    await queueRetryJob(quoteId);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### Webhook Receiver: `/api/integrations/crm/webhook`

```typescript
export async function POST(request: NextRequest) {
  // Validate signature
  const signature = request.headers.get('x-crm-signature');
  if (!validateSignature(signature, await request.text())) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const body = await request.json();
  const { quoteId, status } = body; // 'accepted' | 'rejected'

  await updateQuote(quoteId, { status });
  
  return NextResponse.json({ success: true });
}
```

---

## Analytics & Logging

### Event Types

```typescript
type AnalyticsEventType =
  | 'page_view'
  | 'package_view'
  | 'package_compare_view'
  | 'price_calc'
  | 'add_to_cart'
  | 'quote_start'
  | 'quote_step_complete'
  | 'quote_submit'
  | 'quote_share'
  | 'quote_pdf_download';
```

### Implementation: `frontend/src/services/analytics/events.ts`

```typescript
export async function trackEvent(
  eventType: AnalyticsEventType,
  payload: Record<string, any>
) {
  // Client-side tracking
  if (typeof window !== 'undefined') {
    // Send to server
    await fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        packageSlug: payload.packageSlug,
        payload,
        timestamp: new Date().toISOString(),
      }),
    });

    // Also send to external analytics (if configured)
    if (window.gtag) {
      window.gtag('event', eventType, payload);
    }
  }
}

// Usage
trackEvent('package_view', { slug: 'apartment-basic' });
trackEvent('price_calc', { slug: 'house-pro', total: 5990 });
```

### Dashboard Data: `/api/admin/analytics/dashboard`

```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from') || getLast30Days();
  const to = searchParams.get('to') || new Date().toISOString();

  // Funnel
  const visits = await getEventCount('page_view', from, to);
  const builderStarts = await getEventCount('quote_start', from, to);
  const quotesSubmitted = await getEventCount('quote_submit', from, to);
  const conversions = await getQuotesWithStatus('accepted', from, to);

  // Top packages
  const topPackages = await getTopPackages(from, to);

  // Recent events
  const recentEvents = await getRecentEvents(24); // Last 24h

  return NextResponse.json({
    success: true,
    data: {
      funnel: {
        visits,
        builderStarts,
        quotesSubmitted,
        conversions,
        conversionRate: (conversions / visits) * 100,
      },
      topPackages,
      recentEvents,
    },
  });
}
```

---

## Versioning & Rollback

### Version Creation

When admin updates a package:
1. Create new entry in `package_versions` with current data
2. Increment `packages.version`
3. Update `packages.updated_at`

### Rollback Flow

```typescript
// POST /api/packages/[id]/rollback/[version]
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; version: string } }
) {
  const { id, version } = params;

  // Get version data
  const versionData = await getPackageVersion(id, parseInt(version));
  
  if (!versionData) {
    return NextResponse.json(
      { success: false, error: 'Version not found' },
      { status: 404 }
    );
  }

  // Restore package
  await updatePackage(id, {
    ...versionData.data,
    version: versionData.version + 1, // New version
  });

  // Create new version entry for rollback
  await createPackageVersion(id, {
    version: versionData.version + 1,
    data: versionData.data,
    changes_summary: `Rolled back to version ${version}`,
  });

  return NextResponse.json({ success: true });
}
```

---

## Security

### Authentication & Authorization

```typescript
// JWT middleware for protected routes
export function requireAuth(handler: NextApiHandler) {
  return async (req: NextRequest, res: NextResponse) => {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    req.user = user;
    return handler(req, res);
  };
}

// Role-based access
export function requireRole(role: string) {
  return (handler: NextApiHandler) => {
    return requireAuth(async (req, res) => {
      if (req.user.role !== role && req.user.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return handler(req, res);
    });
  };
}
```

### Rate Limiting

```typescript
import { RateLimiter } from 'limiter';

const priceCalcLimiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: 'minute',
});

export async function POST(request: NextRequest) {
  const remaining = await priceCalcLimiter.removeTokens(1);
  
  if (remaining < 0) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  // Continue with price calculation
}
```

### CSRF Protection

```typescript
import { csrf } from '@/lib/csrf';

export async function POST(request: NextRequest) {
  // Verify CSRF token
  const isValid = await csrf.verify(request);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }

  // Continue
}
```

### Input Validation

```typescript
import { z } from 'zod';

const quoteSchema = z.object({
  packageSlug: z.string().min(1),
  options: z.object({
    cameras: z.number().min(1).max(50),
    aiDetection: z.enum(['basic', 'advanced', 'enterprise']),
  }),
  contact: z.object({
    name: z.string().min(2),
    phone: z.string().regex(/^0[2-9]\d{7,8}$/),
    email: z.string().email().optional(),
  }),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = quoteSchema.safeParse(body);
  
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.error },
      { status: 400 }
    );
  }

  // Use validated data
  const { data } = validation;
}
```

---

## Testing Strategy

### Unit Tests

```typescript
// frontend/src/services/packages/price.test.ts
describe('calculatePackagePrice', () => {
  it('should calculate base price correctly', () => {
    const pkg = getTestPackage();
    const options = { cameras: 2 };
    const result = calculatePackagePrice(pkg, options);
    expect(result.base).toBe(pkg.pricing.base);
  });

  it('should validate camera range', () => {
    const pkg = getTestPackage();
    const options = { cameras: 100 }; // Too many
    expect(() => calculatePackagePrice(pkg, options)).toThrow();
  });

  it('should apply bulk discount correctly', () => {
    const pkg = getTestPackageWithDiscount();
    const options = { cameras: 10 }; // Triggers bulk discount
    const result = calculatePackagePrice(pkg, options);
    expect(result.discounts).toBeGreaterThan(0);
  });
});
```

### Integration Tests

```typescript
// frontend/src/app/api/price/calc/route.test.ts
describe('POST /api/price/calc', () => {
  it('should return price breakdown', async () => {
    const response = await fetch('/api/price/calc', {
      method: 'POST',
      body: JSON.stringify({
        packageSlug: 'apartment-basic',
        options: { cameras: 3 },
      }),
    });
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.total).toBeGreaterThan(0);
  });

  it('should reject invalid package', async () => {
    const response = await fetch('/api/price/calc', {
      method: 'POST',
      body: JSON.stringify({
        packageSlug: 'invalid-slug',
        options: {},
      }),
    });
    expect(response.status).toBe(404);
  });
});
```

### E2E Tests (Cypress)

```typescript
// cypress/e2e/quote-flow.cy.ts
describe('Quote Builder Flow', () => {
  it('should complete full quote flow', () => {
    cy.visit('/quote');
    
    // Step 1
    cy.get('[data-testid="property-size"]').type('100');
    cy.get('[data-testid="location"]').type('תל אביב');
    cy.get('[data-testid="next-button"]').click();

    // Step 2
    cy.get('[data-testid="package-apartment-basic"]').click();
    cy.get('[data-testid="next-button"]').click();

    // Step 3
    cy.get('[data-testid="cameras-slider"]').setValue(3);
    cy.get('[data-testid="ai-advanced"]').click();
    cy.get('[data-testid="next-button"]').click();

    // Step 4
    cy.get('[data-testid="total-price"]').should('be.visible');
    cy.get('[data-testid="submit-quote"]').click();
    
    cy.url().should('include', '/quote/success');
  });
});
```

---

## CI/CD & Deployment

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=frontend/.next
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### Database Migrations

```typescript
// Using Prisma Migrate
// prisma/migrations/20240101000000_add_packages/migration.sql
-- See Database Schema section above
```

---

## Roadmap & Priorities

### Priority A (Must Have - Pre Production)

- [x] Single source packages (DB/API)
- [x] Price Engine server-side
- [x] Quote/Builder flow with server calc
- [ ] Save draft functionality
- [ ] Admin basic CRUD + versioning
- [ ] Client-server validation & snapshots
- [ ] Analytics events basic (page_view, quote_submit)

### Priority B (Important - Post MVP)

- [ ] Cart integration + checkout
- [ ] CRM integration (webhooks/jobs)
- [ ] PDF generation for quotes
- [ ] Promotions + discount rules
- [ ] Share token functionality
- [ ] Admin analytics dashboard

### Priority C (Nice to Have - Future)

- [ ] Full analytics dashboard with charts
- [ ] Ratings & reviews system
- [ ] ROI calculator
- [ ] AI recommender system
- [ ] Multi-language support
- [ ] A/B testing framework

---

## Checklists

### Development Checklist

- [ ] All types defined in `/types`
- [ ] All components in `/components/packages`
- [ ] Price calculation tested (unit + integration)
- [ ] API endpoints secured (auth + rate limiting)
- [ ] Database schema created
- [ ] Admin panel functional
- [ ] Analytics events tracked
- [ ] Error handling implemented
- [ ] Logging configured

### QA Checklist

- [ ] Price calc matches UI (client/server parity)
- [ ] Share token doesn't allow editing
- [ ] Rollback restores exact previous state
- [ ] PDF reflects server breakdown
- [ ] Promo doesn't double-apply discounts
- [ ] Admin secure (no XSS)
- [ ] Mobile responsive
- [ ] Performance optimized (lazy loading, caching)

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] CDN configured for images
- [ ] Monitoring setup (Sentry, metrics)
- [ ] Backup strategy in place
- [ ] Documentation updated

---

## Summary

מסמך זה מפרט את כל המערכת ברמת הקבצים, API endpoints, זרימות, ואבטחה. המערכת מודולרית, מאובטחת, ומוכנה לסקיילביליטי.

**Next Steps:**
1. Implement server-side price calc endpoint
2. Add draft saving functionality
3. Create admin CRUD for packages
4. Set up analytics tracking
5. Implement CRM integration
6. Add PDF generation

---

**Last Updated:** 2024-01-XX
**Version:** 1.0.0

