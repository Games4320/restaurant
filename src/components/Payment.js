import React, { useState } from 'react';

// Props: total, cart (array of items), onPaymentComplete(orderData)
// Security note: we DO NOT store CVV. We only store the first 4 digits (masked), expiry and cardHolder for demo purposes.
const Payment = ({ total, cart = [], onPaymentComplete }) => {
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [cardNumber, setCardNumber] = useState(''); // formatted (with spaces)
    const [rawCardNumber, setRawCardNumber] = useState(''); // digits only
    const [expiry, setExpiry] = useState(''); // MM/YY
    const [cvv, setCvv] = useState(''); // will NOT be saved
    const [cardHolder, setCardHolder] = useState('');
    const [errors, setErrors] = useState([]);

    const handlePayment = (e) => {
        e.preventDefault();

        // Validate required fields
        const nextErrors = [];
        if (!cardHolder || cardHolder.trim().length === 0) nextErrors.push('נא להזין את שם בעל הכרטיס.');
        if (!rawCardNumber || rawCardNumber.length !== 16) nextErrors.push('מספר כרטיס חייב להכיל 16 ספרות.');
        const expiryRe = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;
        if (!expiryRe.test(expiry)) nextErrors.push('תוקף חייב להיות בפורמט MM/YY.');
        if (!cvv || cvv.length !== 3) nextErrors.push('יש להזין CVV של 3 ספרות.');

        if (nextErrors.length > 0) {
            setErrors(nextErrors);
            return;
        }

        setErrors([]);

        // Simulate payment processing
        setTimeout(() => {
            setPaymentSuccess(true);
            if (onPaymentComplete) {
                const maskedLast4 = rawCardNumber ? rawCardNumber.slice(-4) : null;
                const order = {
                    id: Date.now(),
                    items: cart,
                    total,
                    cardLast4: maskedLast4,
                    expiry: expiry,
                    cardHolder: cardHolder || null,
                    createdAt: new Date().toISOString()
                };
                onPaymentComplete(order);
            }
        }, 1000);
    };

    const handleCardNumberChange = (e) => {
        const inputVal = e.target.value.replace(/\D/g, ''); // Remove non-digits
        const digits = inputVal.substring(0, 16);
        setRawCardNumber(digits);
        let formattedVal = '';
        for (let i = 0; i < digits.length; i += 4) {
            formattedVal += digits.substring(i, i + 4) + ' ';
        }
        setCardNumber(formattedVal.trim().substring(0, 19)); // Limit to 16 digits + spaces
    };

    if (paymentSuccess) {
        return (
            <div className="alert alert-success" role="alert">
                התשלום בוצע בהצלחה! תודה רבה.
            </div>
        );
    }

    return (
        <div className="container mt-4">
            {total > 0 && !showPaymentForm && (
                <button className="btn btn-success" onClick={() => setShowPaymentForm(true)}>
                    מעבר לתשלום (₪{total.toFixed(2)})
                </button>
            )}

            {showPaymentForm && (
                <div className="card p-4">
                    <h3>פרטי תשלום</h3>
                    {errors.length > 0 && (
                        <div className="alert alert-danger" role="alert">
                            <ul className="mb-0">
                                {errors.map((err, idx) => <li key={idx}>{err}</li>)}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={handlePayment}>
                        <div className="mb-3">
                            <label htmlFor="cardHolder" className="form-label">שם בעל הכרטיס</label>
                            <input
                                type="text"
                                className="form-control"
                                id="cardHolder"
                                placeholder="שם בעל הכרטיס"
                                value={cardHolder}
                                onChange={(e) => setCardHolder(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="cardNumber" className="form-label">מספר כרטיס</label>
                            <input
                                type="tel"
                                className="form-control"
                                id="cardNumber"
                                placeholder="xxxx xxxx xxxx xxxx"
                                required
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                title="מספר כרטיס חייב להכיל עד 16 ספרות."
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="expiryDate" className="form-label">תוקף (MM/YY)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="expiryDate"
                                    placeholder="MM/YY"
                                    required
                                    maxLength="5"
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="cvv" className="form-label">CVV</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    id="cvv"
                                    placeholder="xxx"
                                    required
                                    maxLength="3"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary">שלם עכשיו</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Payment;
