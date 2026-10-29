import type { CartItem } from '../features/cart/cartSlice';
import type { Offer } from '../types/offer.type'

export interface AppliedOffer {
  offerId: string;
  title: string;
  description: string;
  savings: number;
}

export interface Bill {
  subtotal: number;
  appliedOffers: AppliedOffer[];
  totalSavings: number;
  finalAmount: number;
}

export const calculateBill = (
  items: CartItem[],
  offers: Offer[]
): Bill => {
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  let remainingAmount = subtotal;
  const appliedOffers: AppliedOffer[] = [];

  for (const offer of offers) {
    if (remainingAmount < offer.minimumPurchase) {
      continue;
    }

    let savings = 0;

    if (offer.type === 'percentage') {
      savings = (remainingAmount * offer.discountValue) / 100;
    } else if (offer.type === 'flat') {
      savings = offer.discountValue;
    }

    // Never discount more than the remaining bill amount.
    savings = Math.min(
      Math.max(0, savings),
      remainingAmount
    );

    if (savings > 0) {
      savings = Math.round(savings * 100) / 100;

      appliedOffers.push({
        offerId: offer.id,
        title: offer.title,
        description: offer.description,
        savings,
      });

      remainingAmount = Math.round(
        (remainingAmount - savings) * 100
      ) / 100;
    }
  }

  const totalSavings = Math.round(
    appliedOffers.reduce((total, offer) => total + offer.savings, 0) * 100
  ) / 100;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    appliedOffers,
    totalSavings,
    finalAmount: Math.max(0, Math.round((subtotal - totalSavings) * 100) / 100),
  };
};