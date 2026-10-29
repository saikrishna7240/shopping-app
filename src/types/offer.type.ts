export interface Offer {
  id: string;
  title: string;
  description: string;
  type: 'percentage' | 'flat';
  discountValue: number;
  minimumPurchase: number;
}