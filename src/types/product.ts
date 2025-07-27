export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  imageUrl: string; // Main image url
  galleryImages?: string[]; // Additional images for the product
  price: number;
  inStock: boolean;
  tags?: string[];
}
