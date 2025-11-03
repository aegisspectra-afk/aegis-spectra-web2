// User permissions and access control based on subscription plans
export interface UserPermissions {
  // Navigation items
  sidebarItems: string[];
  
  // Feature access
  features: {
    orders: boolean;
    products: boolean;
    inventory: boolean;
    customers: boolean;
    shipping: boolean;
    analytics: boolean;
    reports: boolean;
    settings: boolean;
    store: boolean;
  };
  
  // Limits
  limits: {
    products: number;
    orders: number;
    customers: number;
    storage: number; // GB
    cameras: number; // Camera count limit
  };
  
  // Settings access
  settings: {
    basic: boolean;
    advanced: boolean;
    system: boolean;
  };
}

export function getUserPermissions(
  userRole: string, 
  subscriptionPlan: string
): UserPermissions {
  
  // SUPER_ADMIN - Full access to everything
  if (userRole === 'SUPER_ADMIN') {
    return {
      sidebarItems: ['Panel', 'SaaS Dashboard', 'Network Scans', 'Search', 'Orders', 'Products', 'Inventory', 'Customers', 'Shipping', 'Cameras', 'Security', 'Cyber Defense', 'Deployment', 'Analytics', 'Reports', 'Users', 'Settings', 'Billing', 'License Manager', 'Downloads', 'Store'],
      features: {
        orders: true,
        products: true,
        inventory: true,
        customers: true,
        shipping: true,
        analytics: true,
        reports: true,
        settings: true,
        store: true,
      },
      limits: {
        products: Infinity,
        orders: Infinity,
        customers: Infinity,
        storage: Infinity,
        cameras: Infinity,
      },
      settings: {
        basic: true,
        advanced: true,
        system: true,
      },
    };
  }
  
  // ADMIN - Access to most features except system
  if (userRole === 'ADMIN') {
    return {
      sidebarItems: ['Panel', 'SaaS Dashboard', 'Network Scans', 'Search', 'Orders', 'Products', 'Inventory', 'Customers', 'Shipping', 'Cameras', 'Security', 'Cyber Defense', 'Deployment', 'Analytics', 'Reports', 'Users', 'Settings', 'Billing', 'License Manager', 'Downloads', 'Store'],
      features: {
        orders: true,
        products: true,
        inventory: true,
        customers: true,
        shipping: true,
        analytics: true,
        reports: true,
        settings: true,
        store: true,
      },
      limits: {
        products: Infinity,
        orders: Infinity,
        customers: Infinity,
        storage: Infinity,
        cameras: Infinity,
      },
      settings: {
        basic: true,
        advanced: true,
        system: false,
      },
    };
  }
  
  // CLIENT users - Based on subscription plan
  switch (subscriptionPlan) {
    case 'BASIC':
      return {
        sidebarItems: ['Panel', 'SaaS Dashboard', 'Search', 'Orders', 'Products', 'Downloads', 'Store'],
        features: {
          orders: true,
          products: true,
          inventory: false,
          customers: false,
          shipping: false,
          analytics: false,
          reports: false,
          settings: false,
          store: true,
        },
        limits: {
          products: 50,
          orders: 100,
          customers: 50,
          storage: 1, // 1GB
          cameras: 5, // 5 cameras
        },
        settings: {
          basic: true,
          advanced: false,
          system: false,
        },
      };
      
    case 'PRO':
      return {
      sidebarItems: ['Panel', 'SaaS Dashboard', 'Network Scans', 'Search', 'Orders', 'Products', 'Inventory', 'Customers', 'Cameras', 'Analytics', 'Reports', 'Settings', 'Downloads', 'Store'],
        features: {
          orders: true,
          products: true,
          inventory: true,
          customers: true,
          shipping: false,
          analytics: true,
          reports: true,
          settings: true,
          store: true,
        },
        limits: {
          products: 500,
          orders: 1000,
          customers: 500,
          storage: 10, // 10GB
          cameras: 25, // 25 cameras
        },
        settings: {
          basic: true,
          advanced: true,
          system: false,
        },
      };
      
    case 'BUSINESS':
      return {
      sidebarItems: ['Panel', 'SaaS Dashboard', 'Network Scans', 'Search', 'Orders', 'Products', 'Inventory', 'Customers', 'Shipping', 'Cameras', 'Security', 'Analytics', 'Reports', 'Settings', 'Downloads', 'Store'],
        features: {
          orders: true,
          products: true,
          inventory: true,
          customers: true,
          shipping: true,
          analytics: true,
          reports: true,
          settings: true,
          store: true,
        },
        limits: {
          products: Infinity,
          orders: Infinity,
          customers: Infinity,
          storage: 100, // 100GB
          cameras: 100, // 100 cameras
        },
        settings: {
          basic: true,
          advanced: true,
          system: false,
        },
      };
      
    case 'ENTERPRISE':
      return {
      sidebarItems: ['Panel', 'SaaS Dashboard', 'Network Scans', 'Search', 'Orders', 'Products', 'Inventory', 'Customers', 'Shipping', 'Cameras', 'Security', 'Cyber Defense', 'Deployment', 'Analytics', 'Reports', 'Users', 'Settings', 'Billing', 'License Manager', 'Downloads', 'Store'],
        features: {
          orders: true,
          products: true,
          inventory: true,
          customers: true,
          shipping: true,
          analytics: true,
          reports: true,
          settings: true,
          store: true,
        },
        limits: {
          products: Infinity,
          orders: Infinity,
          customers: Infinity,
          storage: Infinity,
          cameras: Infinity,
        },
        settings: {
          basic: true,
          advanced: true,
          system: true,
        },
      };
      
    default: // FREE or unknown
      return {
        sidebarItems: ['Panel', 'SaaS Dashboard', 'Search', 'Downloads', 'Store'],
        features: {
          orders: false,
          products: false,
          inventory: false,
          customers: false,
          shipping: false,
          analytics: false,
          reports: false,
          settings: false,
          store: true,
        },
        limits: {
          products: 0,
          orders: 0,
          customers: 0,
          storage: 0,
          cameras: 0,
        },
        settings: {
          basic: false,
          advanced: false,
          system: false,
        },
      };
  }
}

// Helper function to check if user can access a specific feature
export function canAccessFeature(
  userRole: string,
  subscriptionPlan: string,
  feature: keyof UserPermissions['features']
): boolean {
  const permissions = getUserPermissions(userRole, subscriptionPlan);
  return permissions.features[feature] || false;
}

// Helper function to check if user can access a specific sidebar item
export function canAccessSidebarItem(
  userRole: string,
  subscriptionPlan: string,
  item: string
): boolean {
  const permissions = getUserPermissions(userRole, subscriptionPlan);
  return permissions.sidebarItems.includes(item);
}

// Helper function to get user's product limit
export function getProductLimit(userRole: string, subscriptionPlan: string): number {
  const permissions = getUserPermissions(userRole, subscriptionPlan);
  return permissions.limits.products;
}

// Helper function to check if user can add more products
export function canAddProduct(
  userRole: string,
  subscriptionPlan: string,
  currentProductCount: number
): boolean {
  const limit = getProductLimit(userRole, subscriptionPlan);
  return currentProductCount < limit;
}