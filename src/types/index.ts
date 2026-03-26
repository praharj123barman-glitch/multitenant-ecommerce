export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProductTenant {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  status: string;
  category: ProductCategory | null;
  images: Array<ProductImage | null>;
  tenant: ProductTenant | null;
  averageRating: number;
  reviewCount: number;
  salesCount: number;
  createdAt: string;
}

export interface ProductListResult {
  products: Product[];
  totalDocs: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  parent: string | null;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}
