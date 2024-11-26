export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  extras?: {
    name: string;
    price: number;
    quantity: number;
  }[];
  type: 'hamburguer' | 'drink' | 'snack' | 'dessert';
}