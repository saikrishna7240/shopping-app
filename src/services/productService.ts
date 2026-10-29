
import { collection, getDocs } from 'firebase/firestore/lite';
import { db } from './firebase';
import type { Product } from "../types/product.type";

export const getProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, 'products'));

  const products: Product[] = querySnapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as Product[];

  return products;
};
