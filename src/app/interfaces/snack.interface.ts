export interface Snack {
  name: string;
  price: number;
  img?: string;
};

export interface SnackResponse {
  snacks: Snack[];
}