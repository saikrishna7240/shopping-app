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

  const addOffer = (offer: Offer, rawSavings: number) => {
    const savings = roundMoney(
      Math.min(Math.max(rawSavings, 0), remainingAmount)
    );

    if (savings <= 0) return;

    appliedOffers.push({
      offerId: offer.id,
      title: offer.title,
      description: offer.description,
      savings,
    });

    remainingAmount = roundMoney(remainingAmount - savings);
  };

  for (const offer of offers) {
    if (remainingAmount <= 0) break;

    if (remainingAmount < (offer.minimumPurchase ?? 0)) {
      continue;
    }

    let savings = 0;

    switch (offer.type) {
      case 'percentage': {
        savings = (remainingAmount * offer.discountValue) / 100;
        break;
      }

      case 'flat': {
        savings = offer.discountValue;
        break;
      }

      case 'buy_one_get_one': {
        const targetItem = items.find(
          (item) => item.id === offer.targetProduct
        );

        if (targetItem) {
          const freeQuantity = Math.floor(targetItem.quantity / 2);
          savings = freeQuantity * targetItem.price;
        }

        break;
      }

      case 'conditional_percentage': {
        const triggerItem = items.find(
          (item) => item.id === offer.triggerProduct
        );

        const targetItem = items.find(
          (item) => item.id === offer.targetProduct
        );

        if (triggerItem && triggerItem.quantity > 0 && targetItem) {
          savings =
            targetItem.price * (offer.discountValue / 100);
        }

        break;
      }

      case 'product_percentage': {
        const targetItem = items.find(
          (item) => item.id === offer.targetProduct
        );

        if (targetItem) {
          savings =
            targetItem.price *
            targetItem.quantity *
            (offer.discountValue / 100);
        }

        break;
      }
    }

    addOffer(offer, savings);
  }

  const totalSavings = roundMoney(
    appliedOffers.reduce((total, offer) => total + offer.savings, 0)
  );

  return {
    subtotal,
    appliedOffers,
    totalSavings,
    finalAmount: roundMoney(Math.max(0, subtotal - totalSavings)),
  };
};