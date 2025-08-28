require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const guideRoutes = require('./routes/guideRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const contactRoutes = require('./routes/contactRoutes');
const socialMediaRoutes = require('./routes/socialMediaRoutes');
const adminManageGuidesRoutes = require('./routes/adminManageGuidesRoutes');
const translateRoutes = require('./routes/translateRoutes');
const guideLeaderBoardRoutes = require('./routes/guideLeaderBoardRoutes');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

app.set('io', io);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
const uploadRoot = path.join(__dirname, 'Uploads', 'socialgroups');
if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

app.use('/profiles', express.static(path.join(__dirname, 'Uploads/profiles')));
app.use('/posts', express.static(path.join(__dirname, 'Uploads/posts')));
app.use('/socialgroups', express.static(path.join(__dirname, 'Uploads/socialgroups')));

app.use('/api/auth', authRoutes);
app.use('/api/guide', guideRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/socialmedia', socialMediaRoutes);
app.use('/api/adminManageGuides', adminManageGuidesRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/guide-leaderboard', guideLeaderBoardRoutes);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinBooking', (bookingId) => {
    socket.join(bookingId);
    console.log(`User joined booking room: ${bookingId}`);
  });

  socket.on('updateLocation', async ({ bookingId, role, latitude, longitude }) => {
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      try {
        const user_id = await new Promise((resolve, reject) => {
          db.query(
            'SELECT guide_id, tourist_id FROM Bookings WHERE id = ?',
            [bookingId],
            (err, results) => {
              if (err) {
                console.error('Error fetching booking:', err.message);
                reject(err);
              }
              if (results.length === 0) {
                reject(new Error('Booking not found'));
              }
              const { guide_id, tourist_id } = results[0];
              resolve(role === 'guide' ? guide_id : tourist_id);
            }
          );
        });

        const insertLocationQuery = `
          INSERT INTO Locations (booking_id, user_id, role, latitude, longitude, updated_at)
          VALUES (?, ?, ?, ?, ?, NOW())
          ON DUPLICATE KEY UPDATE latitude = ?, longitude = ?, updated_at = NOW()
        `;

        await new Promise((resolve, reject) => {
          db.query(
            insertLocationQuery,
            [bookingId, user_id, role, latitude, longitude, latitude, longitude],
            (err) => {
              if (err) {
                console.error('Database error inserting location:', err.message);
                reject(err);
              }
              resolve();
            }
          );
        });

        console.log(`Location updated in booking ${bookingId} for ${role}: ${latitude}, ${longitude}`);
        io.to(bookingId).emit('locationUpdate', { bookingId, role, latitude, longitude });
      } catch (error) {
        console.error('Error updating location:', error.message);
      }
    } else {
      console.error('Invalid location data:', { bookingId, role, latitude, longitude });
    }
  });

  socket.on('requestTouristLocation', ({ bookingId }) => {
    io.to(bookingId).emit('requestTouristLocation', { bookingId });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});