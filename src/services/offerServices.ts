import { collection, getDocs } from 'firebase/firestore/lite';
import { db } from './firebase';
import type { Offer } from '../types/offer.type';

export const getOffers = async (): Promise<Offer[]> => {
  const snapshot = await getDocs(collection(db, 'offers'));

  return snapshot.docs.map((document) => {
    const data = document.data();

    return {
      id: document.id,
      title: String(data.title ?? ''),
      description: String(data.description ?? ''),
      type: data.type as Offer['type'],
      discountValue: Number(data.discountValue),
      minimumPurchase: Number(data.minimumPurchase ?? 0),
    };
  });
};