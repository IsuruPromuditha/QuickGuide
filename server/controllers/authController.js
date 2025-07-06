const db = require('../config/db');
   const bcrypt = require('bcrypt');
   const jwt = require('jsonwebtoken');
   require('dotenv').config();

   const registerGuide = async (req, res) => {
       const { name, email, national_id, contact, birthday, country, language, experience, password } = req.body;

       if (!name || !email || !national_id || !contact || !birthday || !country || !language || !experience || !password) {
           return res.status(400).json({ error: 'All fields are required' });
       }

       try {
           const hashedPassword = await bcrypt.hash(password, 10);
           const query = `
               INSERT INTO Guides (name, email, national_id, contact, birthday, country, language, experience, password)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           `;
           db.query(query, [name, email, national_id, contact, birthday, country, language, experience, hashedPassword], (err, result) => {
               if (err) {
                   if (err.code === 'ER_DUP_ENTRY') {
                       return res.status(400).json({ error: 'Email or National ID already exists' });
                   }
                   console.error('Database error:', err.message);
                   return res.status(500).json({ error: 'Database error: ' + err.message });
               }
               res.status(201).json({ message: 'Guide registered successfully' });
           });
       } catch (error) {
           console.error('Server error:', error.message);
           res.status(500).json({ error: 'Server error: ' + error.message });
       }
   };

   const registerTourist = async (req, res) => {
       const { name, email, passport, contact, country, language, password } = req.body;

       if (!name || !email || !passport || !contact || !country || !language || !password) {
           return res.status(400).json({ error: 'All fields are required' });
       }

       try {
           const hashedPassword = await bcrypt.hash(password, 10);
           const query = `
               INSERT INTO Tourists (name, email, passport, contact, country, language, password)
               VALUES (?, ?, ?, ?, ?, ?, ?)
           `;
           db.query(query, [name, email, passport, contact, country, language, hashedPassword], (err, result) => {
               if (err) {
                   if (err.code === 'ER_DUP_ENTRY') {
                       return res.status(400).json({ error: 'Email or Passport already exists' });
                   }
                   console.error('Database error:', err.message);
                   return res.status(500).json({ error: 'Database error: ' + err.message });
               }
               res.status(201).json({ message: 'Tourist registered successfully' });
           });
       } catch (error) {
           console.error('Server error:', error.message);
           res.status(500).json({ error: 'Server error: ' + error.message });
       }
   };

   const login = async (req, res) => {
       const { email, password } = req.body;

       if (!email || !password) {
           return res.status(400).json({ error: 'Email and password are required' });
       }

       try {
           // Check Guides table
           db.query('SELECT * FROM Guides WHERE email = ?', [email], async (err, guideResults) => {
               if (err) {
                   console.error('Database error:', err.message);
                   return res.status(500).json({ error: 'Database error: ' + err.message });
               }

               if (guideResults.length > 0) {
                   const guide = guideResults[0];
                   const isMatch = await bcrypt.compare(password, guide.password);
                   if (!isMatch) {
                       return res.status(401).json({ error: 'Invalid credentials' });
                   }

                   const token = jwt.sign(
                       { id: guide.id, role: 'guide' },
                       process.env.JWT_SECRET,
                       { expiresIn: '1h' }
                   );
                   return res.status(200).json({ message: 'Login successful', token, role: 'guide' });
               }

               // Check Tourists table
               db.query('SELECT * FROM Tourists WHERE email = ?', [email], async (err, touristResults) => {
                   if (err) {
                       console.error('Database error:', err.message);
                       return res.status(500).json({ error: 'Database error: ' + err.message });
                   }

                   if (touristResults.length > 0) {
                       const tourist = touristResults[0];
                       const isMatch = await bcrypt.compare(password, tourist.password);
                       if (!isMatch) {
                           return res.status(401).json({ error: 'Invalid credentials' });
                       }

                       const token = jwt.sign(
                           { id: tourist.id, role: 'tourist' },
                           process.env.JWT_SECRET,
                           { expiresIn: '1h' }
                       );
                       return res.status(200).json({ message: 'Login successful', token, role: 'tourist' });
                   }

                   return res.status(401).json({ error: 'Invalid credentials' });
               });
           });
       } catch (error) {
           console.error('Server error:', error.message);
           res.status(500).json({ error: 'Server error: ' + error.message });
       }
   };

   module.exports = { registerGuide, registerTourist, login };