import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import type { Offer } from "../types/offer.type";
import { getOffers } from '../services/offerServices';
import { calculateBill } from '../utils/calculateBill';
import './BillSummary.css';

function BillSummary() {
  const items = useSelector((state: RootState) => state.cart.items);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const data = await getOffers();
        setOffers(data);
      } catch (err) {
        console.error('Failed to load offers:', err);
        setError('Unable to load special offers.');
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, []);

  const bill = calculateBill(items, offers);

  if (loading) {
    return <p className="bill-message">Loading special offers...</p>;
  }

  if (error) {
    return <p className="bill-message bill-error">{error}</p>;
  }

  return (
    <section className="bill-summary">
      <h2>Bill Summary</h2>

      <div className="bill-row">
        <span>Subtotal before offers</span>
        <strong>₹{bill.subtotal.toFixed(2)}</strong>
      </div>

      <div className="offers-list">
        <h3>Special Offers</h3>

        {bill.appliedOffers.length === 0 ? (
          <p className="no-offers">
            No offers currently apply to your cart.
          </p>
        ) : (
          bill.appliedOffers.map((offer) => (
            <div className="offer-row" key={offer.offerId}>
              <div>
                <strong>{offer.title}</strong>
                <p>{offer.description}</p>
              </div>

              <strong className="discount-amount">
                −₹{offer.savings.toFixed(2)}
              </strong>
            </div>
          ))
        )}
      </div>

      <div className="bill-row savings-row">
        <span>Total savings</span>
        <strong>−₹{bill.totalSavings.toFixed(2)}</strong>
      </div>

      <div className="bill-row final-amount">
        <span>Final payable amount</span>
        <strong>₹{bill.finalAmount.toFixed(2)}</strong>
      </div>
    </section>
  );
}

export default BillSummary;