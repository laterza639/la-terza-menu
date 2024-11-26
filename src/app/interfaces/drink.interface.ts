export interface Drink {
  name: string;
  size: string;
  price: number;
  img?: string;
};

export interface DrinkResponse {
  drinks: Drink[];
}