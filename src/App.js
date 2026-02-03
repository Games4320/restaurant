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
const MENU_KEY = 'restaurant_menu_v1';

const DEFAULT_MENU = {
  "מאכלים": [
    { id: 1, name: 'פיצה-פיתה', description: 'פיצה טעימה על פיתה', price: 35, image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'פיצה-לוואח', description: 'פיצהלוואח קריספי ', price: 40, image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'חביתה', description: 'חביתה עשירה לבחירתכם', price: 25, image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'טוסט', description: 'טוסט גבינה מפנק', price: 30, image: 'https://via.placeholder.com/150' }
  ],
  "שתייה": [
    { id: 5, name: 'מים', description: 'מים מינרליים', price: 8, image: 'https://via.placeholder.com/150' },
    { id: 6, name: 'פטל', description: 'מיץ פטל ', price: 10, image: 'https://via.placeholder.com/150' },
    { id: 7, name: 'סודה', description: 'סודה קרה', price: 9, image: 'https://via.placeholder.com/150' },
    { id: 8, name: 'קפה', description: 'קפה איכותי', price: 12, image: 'https://via.placeholder.com/150' },
    { id: 9, name: 'שוקו', description: 'שוקו חם ומפנק', price: 14, image: 'https://via.placeholder.com/150' },
    { id: 10, name: 'תה', description: 'תה נענע', price: 10, image: 'https://via.placeholder.com/150' }
  ],
  "קינוחים": [
    { id: 11, name: 'קרפ', description: 'קרפ צרפתי עם שוקולד', price: 28, image: 'https://via.placeholder.com/150' },
    { id: 12, name: 'שוקולד', description: 'עוגת שוקולד עשירה', price: 32, image: 'https://via.placeholder.com/150' },
    { id: 13, name: 'פנקייקים', description: 'פנקייקים עם סירופ מייפל', price: 30, image: 'https://via.placeholder.com/150' }
  ]
};

function App() {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState(DEFAULT_MENU);

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

  // Load menu from localStorage (persisted items added by staff)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(MENU_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') setMenu(parsed);
      }
    } catch (err) {
      console.error('Failed to load menu from localStorage', err);
      setMenu(DEFAULT_MENU);
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

  // Persist menu whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(MENU_KEY, JSON.stringify(menu));
    } catch (err) {
      console.error('Failed to save menu to localStorage', err);
    }
  }, [menu]);

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

  const addMenuItem = ({ name, description, category }) => {
    // create new id by finding max existing id + 1
    const allIds = Object.values(menu).flat().map(i => i.id);
    const maxId = allIds.length ? Math.max(...allIds) : 0;
    const newId = maxId + 1;
    const newItem = { id: newId, name, description, price: 10, image: 'https://via.placeholder.com/150' };
    setMenu(prev => {
      const next = { ...prev };
      // map user's category to internal category keys
      let catKey = 'מאכלים';
      if (category === 'שתייה') catKey = 'שתייה';
      if (category === 'קינוח') catKey = 'קינוחים';
      if (!next[catKey]) next[catKey] = [];
      next[catKey] = [newItem, ...next[catKey]];
      return next;
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
            <Menu addToCart={addToCart} menu={menu} />
          </div>
          <div className="col-md-4">
            {/* Staff login button/modal (one-time modal view) */}
            <StaffLogin orders={orders} addMenuItem={addMenuItem} />

            <Cart cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />
            <Payment total={getTotalPrice()} cart={cart} onPaymentComplete={handlePaymentComplete} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;