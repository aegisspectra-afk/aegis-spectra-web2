// Shopify Storefront API client
import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN!,
  apiVersion: '2024-01',
  publicAccessToken: process.env.SHOPIFY_STOREFRONT_TOKEN!
});

// GraphQL queries
const PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          tags
          metafields(first: 10) {
            edges {
              node {
                key
                value
                namespace
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_QUERY = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      availableForSale
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      tags
      metafields(first: 10) {
        edges {
          node {
            key
            value
            namespace
          }
        }
      }
    }
  }
`;

const COLLECTIONS_QUERY = `
  query getCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          products(first: 10) {
            edges {
              node {
                id
                title
                handle
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Types
export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  availableForSale: boolean;
  price: number;
  currency: string;
  image?: string;
  images: Array<{
    url: string;
    alt: string;
  }>;
  tags: string[];
  metafields: Record<string, string>;
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  products: ShopifyProduct[];
}

// API functions
export async function getProducts(): Promise<ShopifyProduct[]> {
  try {
    const { data } = await client.request(PRODUCTS_QUERY, {
      variables: { first: 50 }
    });
    
    return data.products.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      description: edge.node.description,
      handle: edge.node.handle,
      availableForSale: edge.node.availableForSale,
      price: parseFloat(edge.node.priceRange.minVariantPrice.amount),
      currency: edge.node.priceRange.minVariantPrice.currencyCode,
      image: edge.node.images.edges[0]?.node.url,
      images: edge.node.images.edges.map((img: any) => ({
        url: img.node.url,
        alt: img.node.altText || edge.node.title
      })),
      tags: edge.node.tags,
      metafields: edge.node.metafields.edges.reduce((acc: any, field: any) => {
        acc[field.node.key] = field.node.value;
        return acc;
      }, {} as Record<string, string>)
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  try {
    const { data } = await client.request(PRODUCT_QUERY, {
      variables: { handle }
    });
    
    if (!data.product) {
      return null;
    }
    
    return {
      id: data.product.id,
      title: data.product.title,
      description: data.product.description,
      handle: data.product.handle,
      availableForSale: data.product.availableForSale,
      price: parseFloat(data.product.priceRange.minVariantPrice.amount),
      currency: data.product.priceRange.minVariantPrice.currencyCode,
      image: data.product.images.edges[0]?.node.url,
      images: data.product.images.edges.map((img: any) => ({
        url: img.node.url,
        alt: img.node.altText || data.product.title
      })),
      tags: data.product.tags,
      metafields: data.product.metafields.edges.reduce((acc: any, field: any) => {
        acc[field.node.key] = field.node.value;
        return acc;
      }, {} as Record<string, string>)
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function getCollections(): Promise<ShopifyCollection[]> {
  try {
    const { data } = await client.request(COLLECTIONS_QUERY, {
      variables: { first: 50 }
    });
    
    return data.collections.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      handle: edge.node.handle,
      description: edge.node.description,
      products: edge.node.products.edges.map((productEdge: any) => ({
        id: productEdge.node.id,
        title: productEdge.node.title,
        handle: productEdge.node.handle,
        availableForSale: true,
        price: parseFloat(productEdge.node.priceRange.minVariantPrice.amount),
        currency: productEdge.node.priceRange.minVariantPrice.currencyCode,
        description: '',
        image: '',
        images: [],
        tags: [],
        metafields: {}
      }))
    }));
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

// Helper functions
export function getProductsByCategory(products: ShopifyProduct[], category: string): ShopifyProduct[] {
  return products.filter(product => 
    product.tags.includes(category) || 
    product.metafields.category === category
  );
}

export function formatPrice(amount: number, currency: string = 'ILS'): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Fallback data for when Shopify is not available
export const FALLBACK_PRODUCTS: ShopifyProduct[] = [
  {
    id: 'residential-basic',
    title: 'חבילת בסיס - בתים פרטיים',
    description: 'הפתרון הבסיסי והחסכוני לבתים פרטיים שמחפשים הגנה אמינה ויעילה',
    handle: 'residential-basic',
    availableForSale: true,
    price: 2990,
    currency: 'ILS',
    image: '/products/residential-basic.jpg',
    images: [{ url: '/products/residential-basic.jpg', alt: 'חבילת בסיס' }],
    tags: ['בתים פרטיים', 'חבילת בסיס', 'אבטחה', 'מצלמות', 'אזעקה'],
    metafields: {
      category: 'residential',
      sector: 'בתים פרטיים'
    }
  },
  {
    id: 'residential-advanced',
    title: 'חבילת מתקדמת - בתים פרטיים',
    description: 'פתרון מתקדם לבתים פרטיים עם טכנולוגיה מתקדמת והגנה מקיפה',
    handle: 'residential-advanced',
    availableForSale: true,
    price: 4990,
    currency: 'ILS',
    image: '/products/residential-advanced.jpg',
    images: [{ url: '/products/residential-advanced.jpg', alt: 'חבילת מתקדמת' }],
    tags: ['בתים פרטיים', 'חבילת מתקדמת', 'אבטחה', 'מצלמות', 'אזעקה', 'חסם'],
    metafields: {
      category: 'residential',
      sector: 'בתים פרטיים'
    }
  },
  {
    id: 'residential-premium',
    title: 'חבילת פרימיום - בתים פרטיים',
    description: 'הפתרון המושלם לבתים פרטיים עם טכנולוגיה מתקדמת ביותר והגנה מקסימלית',
    handle: 'residential-premium',
    availableForSale: true,
    price: 7990,
    currency: 'ILS',
    image: '/products/residential-premium.jpg',
    images: [{ url: '/products/residential-premium.jpg', alt: 'חבילת פרימיום' }],
    tags: ['בתים פרטיים', 'חבילת פרימיום', 'אבטחה', 'מצלמות 4K', 'אזעקה', 'חסם', 'זיהוי פנים'],
    metafields: {
      category: 'residential',
      sector: 'בתים פרטיים'
    }
  },
  {
    id: 'small-business-basic',
    title: 'חבילת עסק בסיסית',
    description: 'הפתרון הבסיסי והחסכוני לעסקים קטנים שמחפשים הגנה אמינה ויעילה',
    handle: 'small-business-basic',
    availableForSale: true,
    price: 4990,
    currency: 'ILS',
    image: '/products/small-business-basic.jpg',
    images: [{ url: '/products/small-business-basic.jpg', alt: 'חבילת עסק בסיסית' }],
    tags: ['עסקים קטנים', 'חבילת בסיס', 'אבטחה', 'מצלמות', 'אזעקה', 'כניסה מבוקרת'],
    metafields: {
      category: 'small-business',
      sector: 'עסקים קטנים'
    }
  },
  {
    id: 'retail-basic',
    title: 'חבילת חנות בסיסית',
    description: 'הפתרון הבסיסי והחסכוני לחנויות שמחפשות הגנה אמינה ויעילה',
    handle: 'retail-basic',
    availableForSale: true,
    price: 6990,
    currency: 'ILS',
    image: '/products/retail-basic.jpg',
    images: [{ url: '/products/retail-basic.jpg', alt: 'חבילת חנות בסיסית' }],
    tags: ['חנויות', 'חבילת בסיס', 'אבטחה', 'מצלמות', 'אזעקה', 'כניסה מבוקרת'],
    metafields: {
      category: 'retail',
      sector: 'חנויות'
    }
  },
  {
    id: 'retail-premium',
    title: 'חבילת חנות פרימיום',
    description: 'הפתרון המושלם לחנויות עם טכנולוגיה מתקדמת ביותר והגנה מקסימלית',
    handle: 'retail-premium',
    availableForSale: true,
    price: 15990,
    currency: 'ILS',
    image: '/products/retail-premium.jpg',
    images: [{ url: '/products/retail-premium.jpg', alt: 'חבילת חנות פרימיום' }],
    tags: ['חנויות', 'חבילת פרימיום', 'אבטחה', 'מצלמות 4K', 'אזעקה', 'זיהוי פנים', 'זיהוי גניבות'],
    metafields: {
      category: 'retail',
      sector: 'חנויות'
    }
  },
  {
    id: 'education-basic',
    title: 'חבילת חינוך בסיסית',
    description: 'הפתרון הבסיסי והחסכוני למוסדות חינוך שמחפשים הגנה אמינה ויעילה',
    handle: 'education-basic',
    availableForSale: true,
    price: 8990,
    currency: 'ILS',
    image: '/products/education-basic.jpg',
    images: [{ url: '/products/education-basic.jpg', alt: 'חבילת חינוך בסיסית' }],
    tags: ['מוסדות חינוך', 'חבילת בסיס', 'אבטחה', 'מצלמות', 'אזעקה', 'כניסה מבוקרת'],
    metafields: {
      category: 'education',
      sector: 'מוסדות חינוך'
    }
  }
];