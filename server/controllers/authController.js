const db = require('../config/db');
   const bcrypt = require('bcrypt');

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

   module.exports = { registerGuide, registerTourist };