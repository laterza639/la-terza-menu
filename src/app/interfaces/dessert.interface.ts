export interface Dessert {
  name: string;
  price: number;
  img?: string;
};

export interface DessertResponse {
  desserts: Dessert[];
}