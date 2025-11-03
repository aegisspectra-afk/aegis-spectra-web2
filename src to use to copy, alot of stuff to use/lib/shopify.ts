
// Shopify Storefront API integration
import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const client = createStorefrontApiClient({
  storeDomain: 'aegis-spectra-security.myshopify.com',
  apiVersion: '2024-01',
  publicAccessToken: 'ee3fea36ebd41fe808334efc1ddbb31c'
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

// API functions
export async function getProducts() {
  const { data } = await client.request(PRODUCTS_QUERY, {
    variables: { first: 50 }
  });
  
  return data.products.edges.map((edge: any) => ({
    id: edge.node.id,
    title: edge.node.title,
    description: edge.node.description,
    handle: edge.node.handle,
    price: edge.node.priceRange.minVariantPrice.amount,
    currency: edge.node.priceRange.minVariantPrice.currencyCode,
    image: edge.node.images.edges[0]?.node.url,
    metafields: edge.node.metafields.edges.reduce((acc: any, field: any) => {
      acc[field.node.key] = field.node.value;
      return acc;
    }, {})
  }));
}

export async function getProduct(handle: string) {
  const { data } = await client.request(PRODUCT_QUERY, {
    variables: { handle }
  });
  
  return {
    id: data.product.id,
    title: data.product.title,
    description: data.product.description,
    handle: data.product.handle,
    price: data.product.priceRange.minVariantPrice.amount,
    currency: data.product.priceRange.minVariantPrice.currencyCode,
    images: data.product.images.edges.map((edge: any) => ({
      url: edge.node.url,
      alt: edge.node.altText
    })),
    metafields: data.product.metafields.edges.reduce((acc: any, field: any) => {
      acc[field.node.key] = field.node.value;
      return acc;
    }, {})
  };
}
