import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../app/store';
import { addToCart } from '../features/cart/cartSlice';
import { getProducts } from '../services/productService';
import type { Product } from '../types/product.type';
import './ProductList.css';

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Unable to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return <p className="product-message">Loading products...</p>;
  }

  if (error) {
    return <p className="product-message error">{error}</p>;
  }

  if (products.length === 0) {
    return <p className="product-message">No products available.</p>;
  }

  return (
    <section className="products-section">
      <h2>Our Products</h2>

      <div className="products-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            {product.image && product.image !== 'product image url' ? (
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
            ) : (
              <div className="product-image-placeholder">
                {product.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="product-info">
              <span className="product-category">{product.category}</span>
              <h3>{product.name}</h3>
<p className="product-price">
  {product.price < 1
    ? `${Math.round(product.price * 100)}p`
    : `£${product.price.toFixed(2)}`}
</p>
              <button
                className="add-to-cart-button"
                onClick={() =>
                  dispatch(
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                      category: product.category,
                    })
                  )
                }
              >
                Add to Cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ProductList;