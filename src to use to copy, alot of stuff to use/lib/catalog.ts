export interface CatalogProduct {
  id: string;
  name: string;
  model: string;
  sku: string;
  brand: string;
  purchasePrice: number;
  salePrice: number;
  notes: string;
  description?: string;
  category: string;
  image?: string;
}

export interface CatalogCategory {
  name: string;
  products: CatalogProduct[];
}

// Parse CSV data and convert to structured format
export function parseCatalogCSV(csvData: string): CatalogCategory[] {
  const lines = csvData.split('\n');
  const categories: CatalogCategory[] = [];
  let currentCategory: CatalogCategory | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check if this is a category header (contains only text, no commas with data)
    if (line.includes(',,,,,,,') || (!line.includes('₪') && !line.match(/^\d+,/))) {
      // This is a category header
      const categoryName = line.replace(/[,\s]+$/, '').trim();
      if (categoryName && !categoryName.includes('מוצר') && !categoryName.includes('קטלוג')) {
        if (currentCategory) {
          categories.push(currentCategory);
        }
        currentCategory = {
          name: categoryName,
          products: []
        };
      }
      continue;
    }

    // Skip header rows (contain "מוצר", "דגם", etc.)
    if (line.includes('מוצר') || line.includes('דגם') || line.includes('מק״ט')) {
      continue;
    }

    // Parse product data
    const columns = line.split(',');
    if (columns.length >= 7) {
      const productNumber = columns[0]?.trim();
      const productName = columns[1]?.trim();
      const model = columns[2]?.trim();
      const sku = columns[3]?.trim();
      const brand = columns[4]?.trim();
      const purchasePriceStr = columns[5]?.trim();
      const salePriceStr = columns[6]?.trim();
      const notes = columns[7]?.trim() || '';

      // Skip empty rows or invalid data
      if (!productNumber || !productName || !sku) continue;

      // Parse prices (remove ₪, commas, spaces, and other non-numeric characters except decimal point)
      const cleanPurchasePrice = purchasePriceStr?.replace(/[₪,\s]/g, '').replace(/[^\d.-]/g, '') || '0';
      const cleanSalePrice = salePriceStr?.replace(/[₪,\s]/g, '').replace(/[^\d.-]/g, '') || '0';
      
      const purchasePrice = parseFloat(cleanPurchasePrice) || 0;
      const salePrice = parseFloat(cleanSalePrice) || 0;
      
      console.log(`Product: ${productName}, Purchase: ${purchasePriceStr} -> ${purchasePrice}, Sale: ${salePriceStr} -> ${salePrice}`);

      if (currentCategory && salePrice > 0) {
        const product: CatalogProduct = {
          id: sku,
          name: productName,
          model: model || '',
          sku: sku,
          brand: brand || '',
          purchasePrice,
          salePrice,
          notes,
          category: currentCategory.name === 'Cameras & Kits (וידאו ואבטחה)' ? 'cameras' : currentCategory.name,
          image: getProductImage(currentCategory.name, productName)
        };

        currentCategory.products.push(product);
      }
    }
  }

  // Add the last category
  if (currentCategory) {
    categories.push(currentCategory);
  }

  console.log('Parsed categories:', categories.length);
  console.log('Total products:', categories.reduce((sum, cat) => sum + cat.products.length, 0));

  return categories;
}

// Generate image path based on category and product name
function getProductImage(category: string, productName: string): string {
  const categoryMap: { [key: string]: string } = {
    'Cameras & Kits (וידאו ואבטחה)': 'camera',
    'NVR / DVR / Storage': 'nvr',
    'Access Control & Entry': 'access',
    'Alarm Systems & Sensors': 'alarm',
    'Networking & Power Accessories': 'networking',
    'Tools & Installation': 'tools',
    'Power & Backup': 'power',
    'Accessories & Maintenance': 'accessories',
    'Smart Home & Integration': 'smart-home',
    'שירותים': 'services'
  };

  const imageCategory = categoryMap[category] || 'default';
  
  // Generate image filename based on product name
  const imageName = productName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 30);

  return `/products/${imageCategory}/${imageName}.jpg`;
}

// Load catalog data from CSV file
export async function loadCatalog(): Promise<CatalogCategory[]> {
  try {
    const fs = await import('fs');
    const path = await import('path');
    
    const csvPath = path.join(process.cwd(), 'public', 'catalog.csv');
    const csvData = fs.readFileSync(csvPath, 'utf-8');
    return parseCatalogCSV(csvData);
  } catch (error) {
    console.error('Error loading catalog:', error);
    return [];
  }
}

// Get all products as a flat array
export function getAllProducts(categories: CatalogCategory[]): CatalogProduct[] {
  return categories.flatMap(category => category.products);
}

// Get products by category
export function getProductsByCategory(categories: CatalogCategory[], categoryName: string): CatalogProduct[] {
  const category = categories.find(cat => cat.name === categoryName);
  return category ? category.products : [];
}

// Search products
export function searchProducts(categories: CatalogCategory[], query: string): CatalogProduct[] {
  const allProducts = getAllProducts(categories);
  const lowercaseQuery = query.toLowerCase();
  
  return allProducts.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.model.toLowerCase().includes(lowercaseQuery) ||
    product.brand.toLowerCase().includes(lowercaseQuery) ||
    product.sku.toLowerCase().includes(lowercaseQuery)
  );
}

// Get product by SKU
export function getProductBySKU(categories: CatalogCategory[], sku: string): CatalogProduct | undefined {
  const allProducts = getAllProducts(categories);
  return allProducts.find(product => product.sku === sku);
}
