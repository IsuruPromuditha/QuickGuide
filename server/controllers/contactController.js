const db = require('../config/db'); 

const contactController = {
  submitContactForm: async (req, res) => {
    try {
      const { name, email, message } = req.body;


      if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      const query = 'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)';
      db.query(query, [name, email, message], (err, result) => {
        if (err) {
          console.error('Error saving contact form submission:', err);
          return res.status(500).json({ error: 'Failed to process your message' });
        }
        res.status(200).json({ message: 'Message received successfully', id: result.insertId });
      });
    } catch (error) {
      console.error('Error processing contact form:', error);
      res.status(500).json({ error: 'Failed to process your message' });
    }
  },
};

module.exports = contactController;