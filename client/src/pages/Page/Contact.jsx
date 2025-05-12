import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt , FaEnvelope, FaClock } from 'react-icons/fa';
import '../../styles/Contact.css';

const Contact = () => {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <div className="section-header">
          <h2 className="section-title">Get In Touch</h2>
          <div className="title-decoration"></div>
          <p className="section-subtitle">
            We'd love to help you find your perfect bridal attire
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">
                <FaMapMarkerAlt />
              </div>
              <h3>Our Boutique</h3>
              <p>123/1057 ,Athani Main Road,<br />Sathyamangalam,Erode, 638401</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FaPhoneAlt  />
              </div>
              <h3>Call Us</h3>
              <p>+91 63813 12841</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FaEnvelope />
              </div>
              <h3>Email Us</h3>
              <p>hello@bridalboutique.com<br />appointments@bridalboutique.com</p>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FaClock />
              </div>
              <h3>Opening Hours</h3>
              <p>Monday - Saturday: 10AM - 8PM<br />Sunday: 11AM - 6PM</p>
            </div>
          </div>

         
        </div>
      </div>
    </section>
  );
};

export default Contact;