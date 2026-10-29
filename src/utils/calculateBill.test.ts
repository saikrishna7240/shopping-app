import { describe, it, expect } from 'vitest';
import { calculateBill } from './calculateBill';
import type { CartItem } from '../features/cart/cartSlice';
import type { Offer } from '../types/offer.type';

const cartItems: CartItem[] = [
  {
    id: 'product-1',
    name: 'Milk',
    price: 200,
    quantity: 2,
    image: '',
    category: 'dairy',
  },
];

const offers: Offer[] = [
  {
    id: 'offer-1',
    title: '10% Discount',
    description: 'Save 10%',
    type: 'percentage',
    discountValue: 10,
    minimumPurchase: 100,
  },
  {
    id: 'offer-2',
    title: 'Flat ₹20 Off',
    description: 'Save ₹20',
    type: 'flat',
    discountValue: 20,
    minimumPurchase: 100,
  },
];

describe('calculateBill', () => {
  it('calculates the subtotal correctly', () => {
    const bill = calculateBill(cartItems, []);

    expect(bill.subtotal).toBe(400);
    expect(bill.finalAmount).toBe(400);
  });

  it('applies percentage and flat discounts', () => {
  const bill = calculateBill(cartItems, offers);

  expect(bill.subtotal).toBe(400);
  expect(bill.totalSavings).toBe(60);
  expect(bill.finalAmount).toBe(340);
});

  it('does not apply offers when the minimum purchase is not met', () => {
    const smallCart: CartItem[] = [
      {
        id: 'product-2',
        name: 'Milk',
        price: 40,
        quantity: 1,
        image: '',
        category: 'dairy',
      },
    ];

    const bill = calculateBill(smallCart, offers);

    expect(bill.subtotal).toBe(40);
    expect(bill.appliedOffers).toHaveLength(0);
    expect(bill.finalAmount).toBe(40);
  });

  it('never reduces the final amount below zero', () => {
    const expensiveOffer: Offer[] = [
      {
        id: 'offer-3',
        title: 'Big Discount',
        description: 'Large flat discount',
        type: 'flat',
        discountValue: 1000,
        minimumPurchase: 100,
      },
    ];

    const bill = calculateBill(cartItems, expensiveOffer);

    expect(bill.finalAmount).toBe(0);
  });
});