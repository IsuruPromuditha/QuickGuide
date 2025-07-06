const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const guideRoutes = require('./routes/guideRoutes');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Serve static files
app.use('/profiles', express.static(path.join(__dirname, 'uploads/profiles')));
app.use('/posts', express.static(path.join(__dirname, 'Uploads/posts')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/guide', guideRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});