import React, { useState } from 'react';
import { GiSriLanka } from 'react-icons/gi';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for form submission logic (e.g., API call)
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-600 mb-4">Contact QuickGuide Sri Lanka</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Have questions or need support? Reach out to us, and we’ll help you plan your perfect Sri Lankan adventure.
        </p>
      </div>

      {/* Contact Form and Info Section */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Form */}
        <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-primary mb-6">Send Us a Message</h2>
          {submitted && (
            <p className="text-green-600 mb-4">Thank you for your message! We’ll get back to you soon.</p>
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
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white font-semibold py-2 rounded-md hover:bg-secondary transition duration-200"
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
              <GiSriLanka className="text-secondary" />
              <span>QuickGuide Sri Lanka, Colombo, Sri Lanka</span>
            </p>
            <p className="flex items-center gap-2 mb-2">
              <GiSriLanka className="text-secondary" />
              <span>Email: support@quickguidesl.com</span>
            </p>
            <p className="flex items-center gap-2">
              <GiSriLanka className="text-secondary" />
              <span>Phone: +94 11 123 4567</span>
            </p>
          </div>
          <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
            <p className="text-gray-600">Map Placeholder (Google Maps API Integration)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;