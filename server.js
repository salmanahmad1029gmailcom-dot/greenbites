// ================= GREEN BITES BACKEND SERVER =================
require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');

const Order = require('./models/Order');
const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- MONGODB CONNECTION ----------
// .env mein MONGO_URI daalna zaroori hai (MongoDB Atlas ya local MongoDB ki link)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB se connect ho gaya ✅'))
  .catch(err => console.error('MongoDB connection error ❌:', err.message));

// ---------- BREVO EMAIL HELPER ----------
// Brevo (sendinblue) transactional email API se notification email bhejta hai.
// Agar .env mein BREVO_API_KEY set nahi hai to ye chup chaap skip ho jata hai
// (server crash nahi hoga, sirf email nahi bhejegi).
async function sendBrevoEmail(subject, htmlContent){
  if(!process.env.BREVO_API_KEY){
    console.log('BREVO_API_KEY not set, email skip ki ja rahi hai.');
    return;
  }
  try{
    await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: {
        name: process.env.BREVO_SENDER_NAME || 'Green Bites',
        email: process.env.BREVO_SENDER_EMAIL
      },
      to: [
        { email: process.env.BREVO_RECEIVER_EMAIL }
      ],
      subject,
      htmlContent
    }, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    console.log('Brevo email bhej di gayi:', subject);
  }catch(err){
    console.error('Brevo email bhejnay mein error:', err.response ? err.response.data : err.message);
  }
}

// ---------- ORDER ROUTES ----------

// Naya order submit karna
app.post('/api/order', async (req, res) => {
  try{
    const { name, phone, address, items } = req.body;

    if(!name || !phone || !address || !items){
      return res.status(400).json({ success:false, message:'All fields are required.' });
    }

    const newOrder = await Order.create({ name, phone, address, items });

    // Brevo se order ki email notification bhejo
    sendBrevoEmail(
      `New Order - Green Bites (${name})`,
      `<h3>New Order Received</h3>
       <p><b>Name:</b> ${name}</p>
       <p><b>Phone:</b> ${phone}</p>
       <p><b>Address:</b> ${address}</p>
       <p><b>Items:</b> ${items}</p>`
    );

    res.json({ success:true, message:'Order received', order:newOrder });
  }catch(err){
    console.error(err);
    res.status(500).json({ success:false, message:'Server error, please try again.' });
  }
});

// Sab orders dekhna (admin ke liye)
app.get('/api/orders', async (req, res) => {
  try{
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success:true, orders });
  }catch(err){
    res.status(500).json({ success:false, message:'Server error' });
  }
});

// Order status update karna (admin ke liye)
app.put('/api/orders/:id', async (req, res) => {
  try{
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if(!order){
      return res.status(404).json({ success:false, message:'Order not found' });
    }
    res.json({ success:true, order });
  }catch(err){
    res.status(500).json({ success:false, message:'Server error' });
  }
});

// ---------- CONTACT ROUTES ----------

// Contact message submit karna
app.post('/api/contact', async (req, res) => {
  try{
    const { name, phone, message } = req.body;

    if(!name || !phone || !message){
      return res.status(400).json({ success:false, message:'All fields are required.' });
    }

    const newContact = await Contact.create({ name, phone, message });

    // Brevo se contact message ki email notification bhejo
    sendBrevoEmail(
      `New Contact Message - Green Bites (${name})`,
      `<h3>New Contact Message</h3>
       <p><b>Name:</b> ${name}</p>
       <p><b>Phone:</b> ${phone}</p>
       <p><b>Message:</b> ${message}</p>`
    );

    res.json({ success:true, message:'Message received', contact:newContact });
  }catch(err){
    console.error(err);
    res.status(500).json({ success:false, message:'Server error, please try again.' });
  }
});

// Sab contact messages dekhna (admin ke liye)
app.get('/api/contacts', async (req, res) => {
  try{
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success:true, contacts });
  }catch(err){
    res.status(500).json({ success:false, message:'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Green Bites backend server running at http://localhost:${PORT}`);
});
