import React, { useState } from 'react';

const StaffPanel = ({ orders = [], addMenuItem, menu = {}, removeMenuItem }) => {
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

            <div className="mt-4">
                <h5>תפריט נוכחי</h5>
                {Object.keys(menu).length === 0 ? (
                    <div className="text-muted">התפריט ריק.</div>
                ) : (
                    Object.keys(menu).map(cat => (
                        <div key={cat} className="mb-3">
                            <h6>{cat}</h6>
                            <ul className="list-group">
                                {menu[cat].map(item => (
                                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{item.name}</strong>
                                            <div className="small text-muted">{item.description}</div>
                                        </div>
                                        <div className="text-end">
                                            <div>₪{(item.price || 0).toFixed(2)}</div>
                                            <button className="btn btn-sm btn-outline-danger mt-2" onClick={() => {
                                                if (window.confirm('להסיר פריט זה מהתפריט?')) {
                                                    removeMenuItem && removeMenuItem(item.id);
                                                }
                                            }}>הסר פריט</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StaffPanel;
