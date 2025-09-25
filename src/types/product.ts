export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  image_url: string;
  gallery_images: string[];
  in_stock: boolean;
  order?: number;
};
