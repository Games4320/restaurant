import React from 'react';

const StaffPanel = ({ orders = [] }) => {
    if (orders.length === 0) {
        return (
            <div className="alert alert-info mt-3">אין הזמנות להצגה כרגע.</div>
        );
    }

    return (
        <div className="card mt-3 p-3">
            <h4>ההזמנות (גישה צוות)</h4>
            <ul className="list-group">
                {orders.map(order => (
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
                ))}
            </ul>
        </div>
    );
};

export default StaffPanel;
