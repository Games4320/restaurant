import React, { useState } from 'react';

const StaffPanel = ({ orders = [], addMenuItem }) => {
    const [showAdd, setShowAdd] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('מאכל');
    const [msg, setMsg] = useState('');

    const resetForm = () => {
        setName('');
        setDescription('');
        setCategory('מאכל');
    };

    const handleAdd = () => {
        if (!name || name.trim().length === 0) {
            setMsg('יש להזין שם פריט.');
            return;
        }
    // category value ("מאכל", "שתייה" or "קינוח") is passed through
        // call addMenuItem if provided
        if (addMenuItem) {
            addMenuItem({ name: name.trim(), description: description.trim(), category });
            setMsg('הפריט נוסף בהצלחה.');
            resetForm();
            setShowAdd(false);
            setTimeout(() => setMsg(''), 3000);
        } else {
            setMsg('לא ניתן להוסיף פריטים - פונקציה לא זמינה.');
        }
    };

    return (
        <div className="card mt-3 p-3">
            <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">ההזמנות (גישה צוות)</h4>
                <button className="btn btn-sm btn-outline-primary" onClick={() => setShowAdd(true)}>הוסף פריט</button>
            </div>

            {msg && <div className="alert alert-info mt-3">{msg}</div>}

            {showAdd && (
                <div className="card p-3 mt-3">
                    <h5>הוסף פריט חדש</h5>
                    <div className="mb-2">
                        <label className="form-label">שם הפריט</label>
                        <input className="form-control" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="mb-2">
                        <label className="form-label">תיאור הפריט</label>
                        <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                    <div className="mb-2">
                        <label className="form-label">קטגוריית הפריט</label>
                        <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                            <option value="מאכל">מאכל</option>
                            <option value="שתייה">שתייה</option>
                            <option value="קינוח">קינוח</option>
                        </select>
                    </div>
                    <div className="d-flex gap-2">
                        <button className="btn btn-primary" onClick={handleAdd}>הוסף</button>
                        <button className="btn btn-secondary" onClick={() => { setShowAdd(false); resetForm(); setMsg(''); }}>ביטול</button>
                    </div>
                </div>
            )}

            <ul className="list-group mt-3">
                {orders.length === 0 ? (
                    <li className="list-group-item">אין הזמנות להצגה כרגע.</li>
                ) : (
                    orders.map(order => (
                        <li key={order.id} className="list-group-item">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <strong>הזמנה #{order.id}</strong>
                                    <div className="text-muted small">{new Date(order.createdAt).toLocaleString()}</div>
                                    <ul className="mb-0 mt-2">
                                        {order.items && order.items.length > 0 ? (
                                            order.items.map(it => (
                                                <li key={it.id}>{it.name} x {it.quantity}</li>
                                            ))
                                        ) : (
                                            <li>ריקה</li>
                                        )}
                                    </ul>
                                </div>
                                <div className="text-end">
                                    <div>סה"כ: ₪{order.total.toFixed(2)}</div>
                                    <div>כרטיס (4 ספרות אחרונות): {order.cardLast4 ? order.cardLast4 : '----'}</div>
                                    {order.cardHolder && <div>שם בעל הכרטיס: {order.cardHolder}</div>}
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default StaffPanel;
