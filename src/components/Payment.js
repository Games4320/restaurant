import React, { useState } from 'react';

// Props: total, cart (array of items), onPaymentComplete(orderData)
// Security note: we DO NOT store CVV. We only store the first 4 digits (masked) and cardHolder for demo purposes.
const Payment = ({ total, cart = [], onPaymentComplete }) => {
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [cardNumber, setCardNumber] = useState(''); // formatted (with spaces)
    const [rawCardNumber, setRawCardNumber] = useState(''); // digits only
    // expiry removed: we don't collect or store card expiry
    const [cvv, setCvv] = useState(''); // will NOT be saved
    const [cardHolder, setCardHolder] = useState('');
    // per-field error messages
    const [errors, setErrors] = useState({ cardHolder: '', cardNumber: '', cvv: '' });

    const handlePayment = (e) => {
        e.preventDefault();

        // Validate required fields (collect per-field messages)
    const nextErrors = { cardHolder: '', cardNumber: '', cvv: '' };
        if (!cardHolder || cardHolder.trim().length === 0) nextErrors.cardHolder = 'נא להזין את שם בעל הכרטיס.';
        if (!rawCardNumber || rawCardNumber.length !== 16) nextErrors.cardNumber = 'מספר כרטיס חייב להכיל 16 ספרות.';
        if (!cvv || cvv.length !== 3) nextErrors.cvv = 'יש להזין CVV של 3 ספרות.';

        // If any field has an error, show them and stop
        const hasErrors = Object.values(nextErrors).some(msg => msg && msg.length > 0);
        if (hasErrors) {
            setErrors(nextErrors);
            return;
        }

        // clear errors
    setErrors({ cardHolder: '', cardNumber: '', cvv: '' });

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

    const validateField = (field, value) => {
        if (field === 'cardHolder') {
            return (!value || value.trim().length === 0) ? 'נא להזין את שם בעל הכרטיס.' : '';
        }
        if (field === 'cardNumber') {
            return (!value || value.length !== 16) ? 'מספר כרטיס חייב להכיל 16 ספרות.' : '';
        }
        if (field === 'cvv') {
            return (!value || value.length !== 3) ? 'יש להזין CVV של 3 ספרות.' : '';
        }
        return '';
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
                    {Object.values(errors).some(msg => msg && msg.length > 0) && (
                        <div className="alert alert-danger" role="alert">
                            <ul className="mb-0">
                                {Object.values(errors).filter(Boolean).map((err, idx) => <li key={idx}>{err}</li>)}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={handlePayment}>
                        <div className="mb-3">
                            <label htmlFor="cardHolder" className="form-label">שם בעל הכרטיס</label>
                            <input
                                type="text"
                                className={`form-control ${errors.cardHolder ? 'is-invalid' : ''}`}
                                id="cardHolder"
                                placeholder="שם הקונה"
                                value={cardHolder}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setCardHolder(v);
                                    setErrors(prev => ({ ...prev, cardHolder: validateField('cardHolder', v) }));
                                }}
                            />
                            {errors.cardHolder && <div className="invalid-feedback d-block">{errors.cardHolder}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="cardNumber" className="form-label">מספר כרטיס</label>
                            <input
                                type="tel"
                                className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                                id="cardNumber"
                                placeholder="xxxx xxxx xxxx xxxx"
                                value={cardNumber}
                                onChange={(e) => {
                                    handleCardNumberChange(e);
                                    const digits = e.target.value.replace(/\D/g, '').substring(0, 16);
                                    setErrors(prev => ({ ...prev, cardNumber: validateField('cardNumber', digits) }));
                                }}
                                title="מספר כרטיס חייב להכיל עד 16 ספרות."
                            />
                            {errors.cardNumber && <div className="invalid-feedback d-block">{errors.cardNumber}</div>}
                        </div>

                        <div className="row">
                            <div className="col-12 mb-3">
                                <label htmlFor="cvv" className="form-label">CVV</label>
                                <input
                                    type="tel"
                                    className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                                    id="cvv"
                                    placeholder="xxx"
                                    maxLength="3"
                                    value={cvv}
                                    onChange={(e) => {
                                        const v = e.target.value.replace(/\D/g, '').substring(0, 3);
                                        setCvv(v);
                                        setErrors(prev => ({ ...prev, cvv: validateField('cvv', v) }));
                                    }}
                                />
                                {errors.cvv && <div className="invalid-feedback d-block">{errors.cvv}</div>}
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
