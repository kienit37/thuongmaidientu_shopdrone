
export type Category = 'Flycam' | 'Action Cam' | 'Phụ kiện';
export type SubCategory = 'DJI Mavic' | 'DJI Mini' | 'DJI Air' | 'DJI FPV' | 'GoPro HERO' | 'Insta360' | 'Pocket' | 'Khác';
export type Condition = 'Mới' | 'Cũ (Like New)' | 'Cũ (95%)';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  subCategory?: SubCategory;
  condition: Condition;
  price: number;
  image: string;
  description: string;
  detailedDescription: {
    overview: string;
    features: string[];
    whatsInBox: string[];
  };
  specs: { [key: string]: string };
  rating: number;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderDetails {
  customerName: string;
  email: string;
  address: string;
  paymentMethod: string;
  items: CartItem[];
  total: number;
}
