import React from 'react';

const Cart = ({ cart, removeFromCart, updateQuantity }) => {
    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <div className="container mt-4">
            <h2>ההזמנה שלך</h2>
            {cart.length === 0 ? (
                <p>עגלת הקניות שלך ריקה.</p>
            ) : (
                <>
                    <ul className="list-group mb-3">
                        {cart.map(item => (
                            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{item.name}</strong>
                                    <br />
                                    <small>₪{item.price.toFixed(2)}</small>
                                </div>
                                <div className="d-flex align-items-center">
                                    <button className="btn btn-secondary btn-sm me-2" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button className="btn btn-secondary btn-sm ms-2" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    <button className="btn btn-danger btn-sm ms-3" onClick={() => removeFromCart(item.id)}>הסר</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <h3>סה"כ: ₪{getTotalPrice()}</h3>
                </>
            )}
        </div>
    );
};

export default Cart;
