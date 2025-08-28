require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const guideRoutes = require('./routes/guideRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const contactRoutes = require('./routes/contactRoutes');
const guideLocationRoutes = require('./routes/guideLocationRoutes');
const socialMediaRoutes = require('./routes/socialMediaRoutes');
const adminManageGuidesRoutes = require('./routes/adminManageGuidesRoutes');
const translateRoutes = require('./routes/translateRoutes');
const locationRoutes = require('./routes/locationRoutes'); // Add this
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

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
app.use('/api/adminManageGuides', adminManageGuidesRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/location', locationRoutes); // Add this

// Socket.IO for realtime location
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join booking room
  socket.on('joinBooking', (bookingId) => {
    socket.join(bookingId);
    console.log(`User joined booking room: ${bookingId}`);
  });

  // Send location update
  socket.on('updateLocation', ({ bookingId, role, latitude, longitude }) => {
    io.to(bookingId).emit('locationUpdate', { role, latitude, longitude });
    console.log(`Location updated in booking ${bookingId} for ${role}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});