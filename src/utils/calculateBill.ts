
import type { CartItem } from '../features/cart/cartSlice';
import type { Offer } from '../types/offer.type';

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

const roundMoney = (amount: number): number =>
  Math.round((amount + Number.EPSILON) * 100) / 100;

export const calculateBill = (
  items: CartItem[],
  offers: Offer[]
): Bill => {
  const subtotal = roundMoney(
    items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  );

  let remainingAmount = subtotal;
  const appliedOffers: AppliedOffer[] = [];

  for (const offer of offers) {
    if (remainingAmount <= 0) break;

    if (remainingAmount < (offer.minimumPurchase ?? 0)) {
      continue;
    }

    let savings = 0;
    let eligible = false;

    switch (offer.type) {
      case 'percentage': {
        savings = (remainingAmount * offer.discountValue) / 100;
        eligible = savings > 0;
        break;
      }

      case 'flat': {
        savings = offer.discountValue;
        eligible = savings > 0;
        break;
      }

      case 'buy_one_get_one': {
        const cheese = items.find(
          (item) => item.id === offer.targetProduct
        );

        if (cheese && cheese.quantity >= 1) {
          eligible = true;

          // Every second Cheese is free.
          const freeQuantity = Math.floor(cheese.quantity / 2);
          savings = freeQuantity * cheese.price;
        }

        break;
      }

      case 'conditional_percentage': {
        const soup = items.find(
          (item) =>
            item.id === offer.triggerProduct &&
            item.quantity > 0
        );

        const bread = items.find(
          (item) =>
            item.id === offer.targetProduct &&
            item.quantity > 0
        );

        if (soup && bread) {
          eligible = true;

          savings = bread.price * (offer.discountValue / 100);
        }

        break;
      }

      case 'product_percentage': {
        const butter = items.find(
          (item) =>
            item.id === offer.targetProduct &&
            item.quantity > 0
        );

        if (butter) {
          eligible = true;

          savings =
            butter.price *
            butter.quantity *
            (offer.discountValue / 100);
        }

        break;
      }
    }

    if (eligible) {
      const actualSavings = roundMoney(
        Math.min(Math.max(savings, 0), remainingAmount)
      );

      appliedOffers.push({
        offerId: offer.id,
        title: offer.title,
        description: offer.description,
        savings: actualSavings,
      });

      remainingAmount = roundMoney(
        remainingAmount - actualSavings
      );
    }
  }

  const totalSavings = roundMoney(
    appliedOffers.reduce(
      (total, offer) => total + offer.savings,
      0
    )
  );

  return {
    subtotal,
    appliedOffers,
    totalSavings,
    finalAmount: roundMoney(
      Math.max(0, subtotal - totalSavings)
    ),
  };
};
