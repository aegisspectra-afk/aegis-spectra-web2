/**
 * Product Base Prices - מחירי מוצרים בסיסיים לחישוב מחירי חבילות
 * 
 * קובץ זה מכיל את המחירים הבסיסיים של כל המוצרים הבודדים
 * כדי לחשב את המחיר ההגיוני של חבילות
 */

export interface BaseProductPrice {
  id: string;
  name: string;
  price: number; // מחיר ב-ILS
  category: 'camera' | 'nvr' | 'storage' | 'ups' | 'accessory' | 'service';
}

/**
 * מחירי מצלמות (ILS)
 */
export const cameraPrices: Record<string, BaseProductPrice> = {
  'camera-2mp-basic': {
    id: 'camera-2mp-basic',
    name: 'מצלמה IP 2MP בסיסית',
    price: 300,
    category: 'camera',
  },
  'camera-4mp-standard': {
    id: 'camera-4mp-standard',
    name: 'מצלמה IP 4MP סטנדרטית',
    price: 450,
    category: 'camera',
  },
  'camera-4mp-ai': {
    id: 'camera-4mp-ai',
    name: 'מצלמה IP 4MP עם AI',
    price: 550,
    category: 'camera',
  },
  'camera-4k': {
    id: 'camera-4k',
    name: 'מצלמה IP 4K',
    price: 750,
    category: 'camera',
  },
  'camera-4k-color-night': {
    id: 'camera-4k-color-night',
    name: 'מצלמה IP 4K Color Night',
    price: 900,
    category: 'camera',
  },
};

/**
 * מחירי NVR (ILS)
 */
export const nvrPrices: Record<string, BaseProductPrice> = {
  'nvr-4ch': {
    id: 'nvr-4ch',
    name: 'NVR 4 ערוצים',
    price: 600,
    category: 'nvr',
  },
  'nvr-8ch': {
    id: 'nvr-8ch',
    name: 'NVR 8 ערוצים',
    price: 900,
    category: 'nvr',
  },
  'nvr-16ch': {
    id: 'nvr-16ch',
    name: 'NVR 16 ערוצים',
    price: 1500,
    category: 'nvr',
  },
  'nvr-32ch': {
    id: 'nvr-32ch',
    name: 'NVR 32 ערוצים',
    price: 2800,
    category: 'nvr',
  },
  'nvr-64ch': {
    id: 'nvr-64ch',
    name: 'NVR 64 ערוצים',
    price: 4500,
    category: 'nvr',
  },
  'nvr-128ch': {
    id: 'nvr-128ch',
    name: 'NVR 128 ערוצים',
    price: 8000,
    category: 'nvr',
  },
};

/**
 * מחירי אחסון HDD (ILS)
 */
export const storagePrices: Record<string, BaseProductPrice> = {
  'hdd-1tb': {
    id: 'hdd-1tb',
    name: 'HDD 1TB',
    price: 250,
    category: 'storage',
  },
  'hdd-2tb': {
    id: 'hdd-2tb',
    name: 'HDD 2TB',
    price: 400,
    category: 'storage',
  },
  'hdd-4tb': {
    id: 'hdd-4tb',
    name: 'HDD 4TB',
    price: 700,
    category: 'storage',
  },
  'hdd-8tb': {
    id: 'hdd-8tb',
    name: 'HDD 8TB',
    price: 1400,
    category: 'storage',
  },
  'hdd-16tb': {
    id: 'hdd-16tb',
    name: 'HDD 16TB',
    price: 2800,
    category: 'storage',
  },
  'hdd-32tb': {
    id: 'hdd-32tb',
    name: 'HDD 32TB',
    price: 5500,
    category: 'storage',
  },
  'hdd-64tb': {
    id: 'hdd-64tb',
    name: 'HDD 64TB',
    price: 11000,
    category: 'storage',
  },
  'hdd-128tb': {
    id: 'hdd-128tb',
    name: 'HDD 128TB',
    price: 22000,
    category: 'storage',
  },
};

/**
 * מחירי UPS (ILS)
 */
export const upsPrices: Record<string, BaseProductPrice> = {
  'ups-500va': {
    id: 'ups-500va',
    name: 'UPS 500VA בסיסי',
    price: 450,
    category: 'ups',
  },
  'ups-1000va': {
    id: 'ups-1000va',
    name: 'UPS 1000VA מתקדם',
    price: 750,
    category: 'ups',
  },
  'ups-1500va': {
    id: 'ups-1500va',
    name: 'UPS 1500VA מקצועי',
    price: 1200,
    category: 'ups',
  },
};

/**
 * מחירי שירותים (ILS)
 */
export const servicePrices: Record<string, BaseProductPrice> = {
  'installation-basic': {
    id: 'installation-basic',
    name: 'התקנה בסיסית (2-4 מצלמות)',
    price: 800,
    category: 'service',
  },
  'installation-standard': {
    id: 'installation-standard',
    name: 'התקנה סטנדרטית (5-8 מצלמות)',
    price: 1200,
    category: 'service',
  },
  'installation-advanced': {
    id: 'installation-advanced',
    name: 'התקנה מתקדמת (9-16 מצלמות)',
    price: 2000,
    category: 'service',
  },
  'installation-enterprise': {
    id: 'installation-enterprise',
    name: 'התקנה Enterprise (17+ מצלמות)',
    price: 3500,
    category: 'service',
  },
  'maintenance-annual-basic': {
    id: 'maintenance-annual-basic',
    name: 'תחזוקה שנתית בסיסית',
    price: 500,
    category: 'service',
  },
  'maintenance-annual-standard': {
    id: 'maintenance-annual-standard',
    name: 'תחזוקה שנתית סטנדרטית',
    price: 800,
    category: 'service',
  },
  'maintenance-annual-advanced': {
    id: 'maintenance-annual-advanced',
    name: 'תחזוקה שנתית מתקדמת',
    price: 1500,
    category: 'service',
  },
  'maintenance-annual-enterprise': {
    id: 'maintenance-annual-enterprise',
    name: 'תחזוקה שנתית Enterprise',
    price: 4000,
    category: 'service',
  },
};

/**
 * מחירי תוספות (ILS)
 */
export const accessoryPrices: Record<string, BaseProductPrice> = {
  'alarm-basic': {
    id: 'alarm-basic',
    name: 'מערכת אזעקה בסיסית',
    price: 1200,
    category: 'accessory',
  },
  'alarm-advanced': {
    id: 'alarm-advanced',
    name: 'מערכת אזעקה מתקדמת',
    price: 2500,
    category: 'accessory',
  },
  'alarm-enterprise': {
    id: 'alarm-enterprise',
    name: 'מערכת אזעקה Enterprise',
    price: 4500,
    category: 'accessory',
  },
  'access-control-basic': {
    id: 'access-control-basic',
    name: 'בקרת כניסה בסיסית',
    price: 3500,
    category: 'accessory',
  },
  'access-control-enterprise': {
    id: 'access-control-enterprise',
    name: 'בקרת כניסה Enterprise',
    price: 5500,
    category: 'accessory',
  },
  'gate-intercom': {
    id: 'gate-intercom',
    name: 'אינטרקום שער',
    price: 1800,
    category: 'accessory',
  },
  'gate-intercom-pro': {
    id: 'gate-intercom-pro',
    name: 'אינטרקום שער מתקדם',
    price: 2400,
    category: 'accessory',
  },
};

/**
 * פונקציה לקבלת מחיר מוצר לפי ID
 */
export function getProductPrice(productId: string): number {
  const allPrices = {
    ...cameraPrices,
    ...nvrPrices,
    ...storagePrices,
    ...upsPrices,
    ...servicePrices,
    ...accessoryPrices,
  };
  
  return allPrices[productId]?.price || 0;
}

/**
 * פונקציה לחישוב מחיר חבילה על בסיס מוצרים
 */
export interface PackageComponents {
  cameras: {
    count: number;
    type: '2mp-basic' | '4mp-standard' | '4mp-ai' | '4k' | '4k-color-night';
  };
  nvr: {
    channels: 4 | 8 | 16 | 32 | 64 | 128;
  };
  storage: {
    size: '1tb' | '2tb' | '4tb' | '8tb' | '16tb' | '32tb' | '64tb' | '128tb';
  };
  ups?: {
    type: '500va' | '1000va' | '1500va';
    included: boolean;
  };
  installation: {
    included: boolean;
    type?: 'basic' | 'standard' | 'advanced' | 'enterprise';
  };
  maintenance?: {
    included: boolean;
    type?: 'basic' | 'standard' | 'advanced' | 'enterprise';
  };
  accessories?: string[]; // Array of accessory IDs
}

export function calculatePackagePriceFromComponents(
  components: PackageComponents
): {
  cameras: number;
  nvr: number;
  storage: number;
  ups: number;
  installation: number;
  maintenance: number;
  accessories: number;
  subtotal: number;
  markup: number; // 15% markup for package deals
  total: number;
} {
  // Calculate cameras cost
  const cameraPrice = getProductPrice(`camera-${components.cameras.type}`);
  const camerasTotal = cameraPrice * components.cameras.count;

  // Calculate NVR cost
  const nvrPrice = getProductPrice(`nvr-${components.nvr.channels}ch`);
  const nvrTotal = nvrPrice;

  // Calculate storage cost
  const storagePrice = getProductPrice(`hdd-${components.storage.size}`);
  const storageTotal = storagePrice;

  // Calculate UPS cost
  let upsTotal = 0;
  if (components.ups?.included && components.ups.type) {
    upsTotal = getProductPrice(`ups-${components.ups.type}`);
  }

  // Calculate installation cost
  let installationTotal = 0;
  if (!components.installation.included) {
    const installationType = components.installation.type || 'basic';
    installationTotal = getProductPrice(`installation-${installationType}`);
  }

  // Calculate maintenance cost
  let maintenanceTotal = 0;
  if (components.maintenance?.included && components.maintenance.type) {
    maintenanceTotal = getProductPrice(`maintenance-annual-${components.maintenance.type}`);
  }

  // Calculate accessories cost
  let accessoriesTotal = 0;
  if (components.accessories) {
    accessoriesTotal = components.accessories.reduce(
      (sum, id) => sum + getProductPrice(id),
      0
    );
  }

  // Calculate subtotal
  const subtotal =
    camerasTotal +
    nvrTotal +
    storageTotal +
    upsTotal +
    installationTotal +
    maintenanceTotal +
    accessoriesTotal;

  // Apply 15% markup for package deals (discount from individual prices)
  const markup = subtotal * 0.15;
  const total = subtotal - markup;

  return {
    cameras: camerasTotal,
    nvr: nvrTotal,
    storage: storageTotal,
    ups: upsTotal,
    installation: installationTotal,
    maintenance: maintenanceTotal,
    accessories: accessoriesTotal,
    subtotal,
    markup,
    total: Math.round(total),
  };
}

