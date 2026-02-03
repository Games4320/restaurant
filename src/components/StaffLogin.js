import React, { useState } from 'react';
import { Modal, Button, Form, FloatingLabel } from 'react-bootstrap';
import StaffPanel from './StaffPanel';

// Props: orders (array)
const StaffLogin = ({ orders = [], addMenuItem, menu = {}, removeMenuItem }) => {
    const [show, setShow] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newCategory, setNewCategory] = useState('מאכל');
    const [newPrice, setNewPrice] = useState('10');
    const [addMsg, setAddMsg] = useState('');

    const handleClose = () => {
        setShow(false);
        setError('');
        setCode('');
        setAuthenticated(false);
    };
    const handleShow = () => setShow(true);

    const handleLogin = () => {
        if (code === '434343') {
            setAuthenticated(true);
            setError('');
        } else {
            setError('קוד שגוי, נסה שוב.');
        }
    };

    const handleAddSubmit = () => {
        if (!newName || newName.trim().length === 0) {
            setAddMsg('יש להזין שם פריט.');
            return;
        }
        if (addMenuItem) {
            const priceNum = parseFloat(newPrice) || 10;
            addMenuItem({ name: newName.trim(), description: newDescription.trim(), category: newCategory, price: priceNum });
            setAddMsg('הפריט נוסף בהצלחה.');
            // reset
            setNewName('');
            setNewDescription('');
            setNewCategory('מאכל');
            setNewPrice('10');
            setTimeout(() => setAddMsg(''), 2500);
            setShowAddModal(false);
        } else {
            setAddMsg('לא ניתן להוסיף פריט - פונקציה לא זמינה.');
        }
    };

    return (
        <>
            <Button variant="outline-secondary" onClick={handleShow} className="mt-3">
                צוות בלבד
            </Button>

            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>כניסת צוות</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!authenticated ? (
                        <>
                            <p>יש להזין את קוד הגישה בן 6 הספרות.</p>
                            <FloatingLabel
                                controlId="floatingPassword"
                                label="קוד גישה"
                                className="mb-3"
                            >
                                <Form.Control 
                                    type="password" 
                                    placeholder="קוד גישה" 
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    maxLength="6"
                                    isInvalid={!!error}
                                />
                                 <Form.Control.Feedback type="invalid">
                                    {error}
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </>
                    ) : (
                        // show staff panel inside modal; closing modal will hide it (one-time view)
                        <>
                            <StaffPanel orders={orders} addMenuItem={addMenuItem} />
                            {addMsg && <div className="mt-2 text-success">{addMsg}</div>}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        סגור
                    </Button>
                    {!authenticated && (
                        <Button variant="primary" onClick={handleLogin}>
                            כניסה
                        </Button>
                    )}
                    {authenticated && (
                        <>
                            <Button variant="outline-primary" onClick={() => setShowAddModal(true)}>הוסף פריט</Button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>

            {/* Add Item modal opened from footer button */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>הוסף פריט חדש</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-2">
                        <Form.Label>שם הפריט</Form.Label>
                        <Form.Control value={newName} onChange={e => setNewName(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>תיאור הפריט</Form.Label>
                        <Form.Control as="textarea" rows={3} value={newDescription} onChange={e => setNewDescription(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>קטגוריית הפריט</Form.Label>
                        <Form.Select value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                            <option value="מאכל">מאכל</option>
                            <option value="שתייה">שתייה</option>
                            <option value="קינוח">קינוח</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>מחיר (ש"ח)</Form.Label>
                        <Form.Control type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} />
                    </Form.Group>
                    {addMsg && <div className="text-success mt-2">{addMsg}</div>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>ביטול</Button>
                    <Button variant="primary" onClick={handleAddSubmit}>הוסף</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default StaffLogin;
