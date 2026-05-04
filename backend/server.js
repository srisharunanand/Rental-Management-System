const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');

dotenv.config();

// Connect to database
const db = require('./config/db');

const app = express();

// ── Middleware ──────────────────────────
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────
app.use('/api', require('./routes/index'));

// ── Health check ────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Rental Management API is running!' });
});

// ── Error Handler ───────────────────────
app.use(require('./middleware/errorHandler'));

// ── Start Server ────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});