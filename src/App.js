import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Payment from './components/Payment';
import StaffLogin from './components/StaffLogin';
import './App.css';

const ORDERS_KEY = 'restaurant_orders_v1';
const ORDERS_LAST_RESET_KEY = 'restaurant_orders_last_reset_v1';
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function App() {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  

  // Load orders from localStorage on mount and reset weekly
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      const lastReset = localStorage.getItem(ORDERS_LAST_RESET_KEY);
      const now = Date.now();

      if (lastReset) {
        const lastResetTime = Date.parse(lastReset);
        if (!isNaN(lastResetTime) && now - lastResetTime > ONE_WEEK_MS) {
          // It's been more than a week since last reset -> clear stored orders
          localStorage.setItem(ORDERS_KEY, JSON.stringify([]));
          localStorage.setItem(ORDERS_LAST_RESET_KEY, new Date().toISOString());
          setOrders([]);
          return;
        }
      } else {
        // initialize last reset time
        localStorage.setItem(ORDERS_LAST_RESET_KEY, new Date().toISOString());
      }

      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setOrders(parsed);
      }
    } catch (err) {
      console.error('Failed to load orders from localStorage', err);
      setOrders([]);
    }
  }, []);

  // Persist orders to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (err) {
      console.error('Failed to save orders to localStorage', err);
    }
  }, [orders]);

  const addToCart = (dish) => {
    setCart(currentCart => {
      const itemInCart = currentCart.find(item => item.id === dish.id);
      if (itemInCart) {
        return currentCart.map(item =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...currentCart, { ...dish, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart(currentCart => currentCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(currentCart =>
      currentCart.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePaymentComplete = (order) => {
    // record order and clear cart
    setOrders(current => [order, ...current]);
    setCart([]);

    // Try to send order email to configured local email server (non-blocking)
    (async () => {
      try {
        await fetch('http://localhost:4000/send-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: order.id,
            items: order.items,
            total: order.total,
            cardLast4: order.cardLast4,
            cardHolder: order.cardHolder
          })
        });
      } catch (err) {
        // fail silently; server may not be configured
        console.warn('Failed to send order email:', err);
      }
    })();

    // --- IFTTT webhook (simple external bot) ---
    // Replace <IFTTT_EVENT> and <IFTTT_KEY> with your values from https://ifttt.com/maker_webhooks
    (async () => {
      try {
        const event = '<IFTTT_EVENT>'; // e.g. order_received
        const key = '<IFTTT_KEY>'; // your maker webhook key
        if (event && key && event !== '<IFTTT_EVENT>' && key !== '<IFTTT_KEY>') {
          const itemsText = (order.items || []).map(i => `${i.name} x ${i.quantity}`).join('\n') || '(ריקה)';
          const url = `https://maker.ifttt.com/trigger/${event}/with/key/${key}`;
          await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              value1: order.id,
              value2: itemsText,
              value3: order.total,
              value4: order.cardLast4
            })
          });
        }
      } catch (err) {
        console.warn('Failed to send IFTTT webhook', err);
      }
    })();
    
    // --- Formspree (sends email via your Formspree form) ---
    (async () => {
      try {
        const FORMSPREE_URL = 'https://formspree.io/f/mjgodzod';
        const itemsText = (order.items || []).map(i => `${i.name} x ${i.quantity}`).join('\n') || '(ריקה)';

        const payload = {
          _subject: `הזמנה חדשה #${order.id}`,
          orderId: order.id,
          items: itemsText,
          total: order.total,
          cardLast4: order.cardLast4,
          cardHolder: order.cardHolder
        };

        await fetch(FORMSPREE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.warn('Failed to send Formspree webhook', err);
      }
    })();
  };

  return (
    <div className="App">
      <Header />
      <main className="container">
        <div className="row">
          <div className="col-md-8">
            <Menu addToCart={addToCart} />
          </div>
          <div className="col-md-4">
            {/* Staff login button/modal (one-time modal view) */}
            <StaffLogin orders={orders} />

            <Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />
            <Payment total={getTotalPrice()} cart={cart} onPaymentComplete={handlePaymentComplete} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;