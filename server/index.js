const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Basic health
app.get('/', (req, res) => res.send('Email server running'));

app.post('/send-order', async (req, res) => {
  const { id, items, total, cardLast4, expiry, cardHolder } = req.body || {};

  // Validate env
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    TO_EMAIL,
    FROM_EMAIL
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !TO_EMAIL || !FROM_EMAIL) {
    console.error('Missing SMTP configuration in environment');
    return res.status(500).json({ error: 'SMTP not configured on server. Set env vars.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT, 10),
      secure: SMTP_SECURE === 'true',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });

    const itemsText = (items || []).map(it => `- ${it.name} x ${it.quantity}`).join('\n');
    const subject = `הזמנה חדשה #${id}`;
    const text = `התקבלה הזמנה חדשה:\n\nמספר הזמנה: ${id}\n\nפריטים:\n${itemsText}\n\nסה"כ: ₪${total}\nכרטיס (4 ספרות אחרונות): ${cardLast4 || '----'}\nתוקף: ${expiry || '----'}\nשם בעל הכרטיס: ${cardHolder || '----'}\n\nזמן: ${new Date().toLocaleString()}`;

    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject,
      text
    });

    console.log('Order email sent:', info.messageId);
    return res.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error('Failed to send email', err);
    return res.status(500).json({ error: 'Failed to send email', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Email server listening on port ${PORT}`);
});
