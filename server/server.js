require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const guideRoutes = require('./routes/guideRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const contactRoutes = require('./routes/contactRoutes');
const guideLocationRoutes = require('./routes/guideLocationRoutes');
const socialMediaRoutes = require('./routes/socialMediaRoutes');
const path = require('path');
const fs = require('fs');


const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
const uploadRoot = path.join(__dirname, 'uploads', 'socialgroups');
if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

// Serve static files
app.use('/profiles', express.static(path.join(__dirname, 'uploads/profiles')));
app.use('/posts', express.static(path.join(__dirname, 'Uploads/posts')));
app.use('/socialgroups', express.static(path.join(__dirname, 'uploads/socialgroups'))); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/guide', guideRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/guide', guideLocationRoutes);
app.use('/api/socialmedia', socialMediaRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});