import React, { useState } from 'react';
import { GiSriLanka } from 'react-icons/gi';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setError(null);
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto bg-white shadow-2xl rounded-2xl p-8 transition-all duration-300">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact QuickGuide Sri Lanka</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have questions or need support? Reach out to us, and we’ll help you plan your perfect Sri Lankan adventure.
          </p>
        </div>

        {/* Contact Form and Info Section */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Form */}
          <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-2xl font-semibold text-primary mb-6">Send Us a Message</h2>
            {submitted && (
              <p className="text-green-600 mb-4 animate-fade-in">Thank you for your message! We’ll get back to you soon.</p>
            )}
            {error && (
              <p className="text-red-500 mb-4 animate-fade-in">{error}</p>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-600 font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                  required
                  aria-required="true"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-600 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your email"
                  required
                  aria-required="true"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-600 font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="5"
                  placeholder="Your message"
                  required
                  aria-required="true"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white font-semibold py-3 rounded-full hover:bg-secondary transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info and Map */}
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold text-primary mb-6">Get in Touch</h2>
            <div className="text-gray-600 mb-6">
              <p className="flex items-center gap-2 mb-2">
                <GiSriLanka className="text-secondary" size={24} />
                <span>QuickGuide Sri Lanka, Colombo, Sri Lanka</span>
              </p>
              <p className="flex items-center gap-2 mb-2">
                <GiSriLanka className="text-secondary" size={24} />
                <span>Email: <a href="mailto:support@quickguidesl.com" className="text-primary hover:text-secondary">support@quickguidesl.com</a></span>
              </p>
              <p className="flex items-center gap-2">
                <GiSriLanka className="text-secondary" size={24} />
                <span>Phone: <a href="tel:+94111234567" className="text-primary hover:text-secondary">+94 11 123 4567</a></span>
              </p>
            </div>
            <div className="h-96 rounded-lg overflow-hidden shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.902897277705!2d79.85855531477286!3d6.90221019501536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2593c4b6c94e3%3A0x2e3e7a4b6c7b9e0!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1698765432109!5m2!1sen!2slk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="QuickGuide Sri Lanka Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;