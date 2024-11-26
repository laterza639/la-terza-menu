export interface Hamburguer {
  name: string;
  price: number;
  ingredients: string;
  img?: string;
};

export interface HamburguerResponse {
  hamburguers: Hamburguer[];
}