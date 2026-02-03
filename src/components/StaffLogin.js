import React, { useState } from 'react';
import { Modal, Button, Form, FloatingLabel } from 'react-bootstrap';
import StaffPanel from './StaffPanel';

// Props: orders (array)
const StaffLogin = ({ orders = [] }) => {
    const [show, setShow] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [authenticated, setAuthenticated] = useState(false);

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
                        <StaffPanel orders={orders} />
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
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default StaffLogin;
