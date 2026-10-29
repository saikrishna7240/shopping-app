import ProductList from './components/ProductList';
import Cart from './components/Cart';
import BillSummary from './components/BillSummary';

function App() {
  return (
    <main>
      <header
        style={{
          padding: '24px',
          background: '#312e81',
          color: '#ffffff',
          textAlign: 'center',
        }}
      >
        <h1>Shopping Offers</h1>
        <p>Choose your products and discover your savings.</p>
      </header>

      <ProductList />
      <Cart />
      <BillSummary />
    </main>
  );
}

export default App;