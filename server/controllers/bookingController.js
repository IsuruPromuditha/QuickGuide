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
              processedDestinations = booking.destinations; // Use the array directly
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

const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status, decline_reason } = req.body;
  const guide_id = req.user.id;

  if (!status || !['confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Valid status is required (confirmed or cancelled)' });
  }

  if (status === 'cancelled' && !decline_reason) {
    return res.status(400).json({ error: 'Decline reason is required for cancelling a booking' });
  }

  try {
    const bookingCheck = await new Promise((resolve, reject) => {
      db.query('SELECT guide_id FROM Bookings WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });

    if (bookingCheck.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (bookingCheck[0].guide_id !== guide_id) {
      return res.status(403).json({ error: 'Unauthorized to update this booking' });
    }

    const query = `
      UPDATE Bookings 
      SET status = ?, decline_reason = ?
      WHERE id = ?
    `;

    db.query(query, [status, decline_reason || null, id], (err, result) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.status(200).json({ message: `Booking ${status} successfully` });
    });
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

module.exports = { createBooking, getBookings, updateBookingStatus };