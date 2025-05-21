import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Guides from './pages/Guides';

function App() {
  return (
    <Router>
      <div className="overflow-x-hidden">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Navbar />
                <About />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Navbar />
                <Contact />
              </>
            }
          />
          <Route
            path="/guides"
            element={
              <>
                <Navbar />
                <Guides />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;