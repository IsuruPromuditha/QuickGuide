const db = require('../config/db');

const createBooking = async (req, res) => {
  const { guide_id, start_location, destinations, vehicle, category, passenger_count } = req.body;
  const tourist_id = req.user.id;

  if (!guide_id || !start_location || !destinations || !vehicle || !category || !passenger_count) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (passenger_count < 1) {
    return res.status(400).json({ error: 'Passenger count must be at least 1' });
  }

  if (!Array.isArray(destinations) || destinations.length === 0) {
    return res.status(400).json({ error: 'At least one destination is required' });
  }

  if (!destinations.every(dest => typeof dest === 'string' && dest.trim())) {
    return res.status(400).json({ error: 'Destinations must be non-empty strings' });
  }

  try {
    const guideCheck = await new Promise((resolve, reject) => {
      db.query('SELECT id FROM Guides WHERE id = ?', [guide_id], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });

    if (guideCheck.length === 0) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    const touristCheck = await new Promise((resolve, reject) => {
      db.query('SELECT id FROM Tourists WHERE id = ?', [tourist_id], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });

    if (touristCheck.length === 0) {
      return res.status(404).json({ error: 'Tourist not found' });
    }

    const query = `
      INSERT INTO Bookings (guide_id, tourist_id, start_location, destinations, vehicle, category, passenger_count, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
    `;
    const destinationsJson = JSON.stringify(destinations);

    db.query(
      query,
      [guide_id, tourist_id, start_location, destinationsJson, vehicle, category, passenger_count],
      (err, result) => {
        if (err) {
          console.error('Database error:', err.message);
          return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        res.status(201).json({ message: 'Booking created successfully', bookingId: result.insertId });
      }
    );
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

const getBookings = async (req, res) => {
  const guide_id = req.user.id;
  const { status } = req.query;

  try {
    let query = `
      SELECT b.id, b.guide_id, b.tourist_id, b.start_location, b.destinations, 
             b.vehicle, b.category, b.passenger_count, b.status, b.created_at,
             t.name AS tourist_name
      FROM Bookings b
      JOIN Tourists t ON b.tourist_id = t.id
      WHERE b.guide_id = ?
    `;
    const queryParams = [guide_id];

    if (status && status !== 'all') {
      query += ` AND b.status = ?`;
      queryParams.push(status);
    }

    db.query(query, queryParams, (err, results) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }

      const processedResults = results.map(booking => {
        let processedDestinations = [];

        try {
          if (Array.isArray(booking.destinations)) {
            if (booking.destinations.every(dest => typeof dest === 'string' && dest.trim())) {
              processedDestinations = booking.destinations;
            } else {
              console.warn(`Invalid destinations array for booking ID ${booking.id}: ${JSON.stringify(booking.destinations)}`);
            }
          } else if (typeof booking.destinations === 'string') {
            const parsed = JSON.parse(booking.destinations);
            if (Array.isArray(parsed) && parsed.every(dest => typeof dest === 'string' && dest.trim())) {
              processedDestinations = parsed;
            } else {
              console.warn(`Invalid destinations format for booking ID ${booking.id}: ${booking.destinations}`);
            }
          } else {
            console.warn(`Unexpected destinations type for booking ID ${booking.id}: ${typeof booking.destinations}`);
          }
        } catch (e) {
          console.error(`Failed to process destinations for booking ID ${booking.id}: ${JSON.stringify(booking.destinations)}`, e.message);
          processedDestinations = [];
        }

        return {
          ...booking,
          destinations: processedDestinations
        };
      });

      console.log('Processed bookings data:', JSON.stringify(processedResults, null, 2));
      res.status(200).json(processedResults);
    });
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

const getTouristBookings = async (req, res) => {
  const tourist_id = req.user.id;

  try {
    const query = `
      SELECT b.id, b.guide_id, b.tourist_id, b.start_location, b.destinations, 
             b.vehicle, b.category, b.passenger_count, b.status, b.created_at, b.decline_reason,
             g.name AS guide_name
      FROM Bookings b
      JOIN Guides g ON b.guide_id = g.id
      WHERE b.tourist_id = ?
    `;

    db.query(query, [tourist_id], (err, results) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }

      const processedResults = results.map(booking => {
        let processedDestinations = [];

        try {
          if (Array.isArray(booking.destinations)) {
            if (booking.destinations.every(dest => typeof dest === 'string' && dest.trim())) {
              processedDestinations = booking.destinations;
            } else {
              console.warn(`Invalid destinations array for booking ID ${booking.id}: ${JSON.stringify(booking.destinations)}`);
            }
          } else if (typeof booking.destinations === 'string') {
            const parsed = JSON.parse(booking.destinations);
            if (Array.isArray(parsed) && parsed.every(dest => typeof dest === 'string' && dest.trim())) {
              processedDestinations = parsed;
            } else {
              console.warn(`Invalid destinations format for booking ID ${booking.id}: ${booking.destinations}`);
            }
          } else {
            console.warn(`Unexpected destinations type for booking ID ${booking.id}: ${typeof booking.destinations}`);
          }
        } catch (e) {
          console.error(`Failed to process destinations for booking ID ${booking.id}: ${JSON.stringify(booking.destinations)}`, e.message);
          processedDestinations = [];
        }

        return {
          ...booking,
          destinations: processedDestinations
        };
      });

      res.status(200).json(processedResults);
    });
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status, decline_reason, guideLatitude, guideLongitude } = req.body;
  const guide_id = req.user.id;
  const io = req.app.get('io');

  if (!status || !['confirmed', 'cancelled', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Valid status is required (confirmed, cancelled, or completed)' });
  }

  if (status === 'cancelled' && !decline_reason) {
    return res.status(400).json({ error: 'Decline reason is required for cancelling a booking' });
  }

  try {
    const bookingCheck = await new Promise((resolve, reject) => {
      db.query('SELECT guide_id, tourist_id, start_location FROM Bookings WHERE id = ?', [id], (err, results) => {
        if (err) {
          console.error('Database error checking booking:', err.message);
          reject(err);
        }
        resolve(results);
      });
    });

    if (bookingCheck.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (bookingCheck[0].guide_id !== guide_id) {
      return res.status(403).json({ error: 'Unauthorized to update this booking' });
    }

    const updateBookingQuery = `
      UPDATE Bookings 
      SET status = ?, decline_reason = ?
      WHERE id = ?
    `;

    await new Promise((resolve, reject) => {
      db.query(updateBookingQuery, [status, decline_reason || null, id], (err, result) => {
        if (err) {
          console.error('Database error updating booking:', err.message);
          return reject(err);
        }
        if (result.affectedRows === 0) {
          return reject(new Error('Booking not found'));
        }
        resolve(result);
      });
    });

    if (status === 'confirmed') {
      const tourist_id = bookingCheck[0].tourist_id;
      const defaultLat = 7.8731;
      const defaultLng = 80.7718;

      if (!Number.isFinite(guideLatitude) || !Number.isFinite(guideLongitude)) {
        return res.status(400).json({ error: 'Guide location must have valid numeric latitude and longitude' });
      }

      const insertLocationQuery = `
        INSERT INTO Locations (booking_id, user_id, role, latitude, longitude, updated_at)
        VALUES (?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE latitude = ?, longitude = ?, updated_at = NOW()
      `;

      await new Promise((resolve, reject) => {
        db.query(
          insertLocationQuery,
          [id, guide_id, 'guide', guideLatitude, guideLongitude, guideLatitude, guideLongitude],
          (err) => {
            if (err) {
              console.error('Database error inserting guide location:', err.message);
              return reject(err);
            }
            resolve();
          }
        );
      });

      // Fetch or set tourist location
      let touristLocation = await new Promise((resolve) => {
        db.query(
          'SELECT latitude, longitude FROM Locations WHERE booking_id = ? AND role = ?',
          [id, 'tourist'],
          (err, results) => {
            if (err) {
              console.error('Error fetching tourist location:', err.message);
              resolve({ latitude: defaultLat, longitude: defaultLng });
            } else {
              resolve(results.length > 0 ? results[0] : { latitude: defaultLat, longitude: defaultLng });
            }
          }
        );
      });

      const touristLat = Number.isFinite(touristLocation.latitude) ? parseFloat(touristLocation.latitude) : defaultLat;
      const touristLng = Number.isFinite(touristLocation.longitude) ? parseFloat(touristLocation.longitude) : defaultLng;

      await new Promise((resolve, reject) => {
        db.query(
          insertLocationQuery,
          [id, tourist_id, 'tourist', touristLat, touristLng, touristLat, touristLng],
          (err) => {
            if (err) {
              console.error('Database error inserting tourist location:', err.message);
              return reject(err);
            }
            resolve();
          }
        );
      });

      const locations = {
        guide: { latitude: parseFloat(guideLatitude), longitude: parseFloat(guideLongitude) },
        tourist: { latitude: touristLat, longitude: touristLng }
      };

      console.log(`Broadcasting location data for booking ${id}:`, JSON.stringify(locations, null, 2));

      io.to(id).emit('bookingStatusUpdate', { bookingId: id, status, locations });
      io.to(id).emit('locationUpdate', { bookingId: id, role: 'guide', latitude: guideLatitude, longitude: guideLongitude });
      io.to(id).emit('requestTouristLocation', { bookingId: id });

      res.status(200).json({ message: `Booking ${status} successfully`, locations });
    } else {
      io.to(id).emit('bookingStatusUpdate', { bookingId: id, status });
      res.status(200).json({ message: `Booking ${status} successfully` });
    }
  } catch (error) {
    console.error('Server error updating booking status:', error.message);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

const getBookingLocations = async (req, res) => {
  const { bookingId } = req.params;
  const user_id = req.user.id;

  try {
    const bookingCheck = await new Promise((resolve, reject) => {
      db.query(
        'SELECT id, guide_id, tourist_id FROM Bookings WHERE id = ? AND (guide_id = ? OR tourist_id = ?)',
        [bookingId, user_id, user_id],
        (err, results) => {
          if (err) {
            console.error('Database error checking booking:', err.message);
            reject(err);
          }
          resolve(results);
        }
      );
    });

    if (bookingCheck.length === 0) {
      return res.status(404).json({ error: 'Booking not found or unauthorized' });
    }

    const locations = await new Promise((resolve, reject) => {
      db.query(
        'SELECT user_id, role, latitude, longitude FROM Locations WHERE booking_id = ?',
        [bookingId],
        (err, results) => {
          if (err) {
            console.error('Database error fetching locations:', err.message);
            reject(err);
          }
          resolve(results);
        }
      );
    });

    const defaultLat = 7.8731;
    const defaultLng = 80.7718;
    const locationData = {
      guide: locations.find(loc => loc.role === 'guide') || { latitude: defaultLat, longitude: defaultLng },
      tourist: locations.find(loc => loc.role === 'tourist') || { latitude: defaultLat, longitude: defaultLng }
    };

    // Convert latitude and longitude to numbers
    locationData.guide.latitude = parseFloat(locationData.guide.latitude);
    locationData.guide.longitude = parseFloat(locationData.guide.longitude);
    locationData.tourist.latitude = parseFloat(locationData.tourist.latitude);
    locationData.tourist.longitude = parseFloat(locationData.tourist.longitude);

    if (!Number.isFinite(locationData.guide.latitude) || !Number.isFinite(locationData.guide.longitude) ||
        !Number.isFinite(locationData.tourist.latitude) || !Number.isFinite(locationData.tourist.longitude)) {
      console.warn(`Invalid coordinates for booking ${bookingId}:`, JSON.stringify(locationData, null, 2));
      locationData.guide = { latitude: defaultLat, longitude: defaultLng };
      locationData.tourist = { latitude: defaultLat, longitude: defaultLng };
    }

    console.log(`Returning location data for booking ${bookingId}:`, JSON.stringify(locationData, null, 2));
    res.status(200).json(locationData);
  } catch (error) {
    console.error('Server error in getBookingLocations:', error.message);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

module.exports = { createBooking, getBookings, updateBookingStatus, getTouristBookings, getBookingLocations };