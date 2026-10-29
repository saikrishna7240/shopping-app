import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from '../features/cart/cartSlice';
import './Cart.css';

function formatPrice(price: number): string {
  if (price < 1) {
    return `${Math.round(price * 100)}p`;
  }

  return `£${price.toFixed(2)}`;
}

function Cart() {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <section className="cart-section">
      <h2>Your Shopping Cart ({items.length})</h2>

      {items.length === 0 ? (
        <p className="empty-cart">Your cart is empty. Add some products!</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <div className="cart-item-details">
                  <h3>{item.name}</h3>

                  <p>{formatPrice(item.price)} each</p>

                  <p>
                    Item total: {formatPrice(item.price * item.quantity)}
                  </p>
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button
                      aria-label={`Decrease ${item.name} quantity`}
                      onClick={() => dispatch(decreaseQuantity(item.id))}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      aria-label={`Increase ${item.name} quantity`}
                      onClick={() => dispatch(increaseQuantity(item.id))}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-button"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="cart-subtotal">
            <span>Subtotal before offers</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
        </>
      )}
    </section>
  );
}

export default Cart;