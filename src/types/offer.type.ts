export type OfferType =
  | 'percentage'
  | 'flat'
  | 'buy_one_get_one'
  | 'conditional_percentage'
  | 'product_percentage';

export interface Offer {
  id: string;
  title: string;
  description: string;
  type: OfferType;
  discountValue: number;
  minimumPurchase: number;

  
  targetProduct?: string;
  triggerProduct?: string;
}