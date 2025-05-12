import React from 'react';
import { FaAward, FaHeart, FaUsers, FaRegSmile } from 'react-icons/fa';
import '../../styles/Whyus.css';

const WhyUs = () => {
  const features = [
    {
      icon: <FaAward className="feature-icon" />,
      title: "Award Winning",
      description: "Recognized for excellence in bridal fashion design and customer satisfaction."
    },
    {
      icon: <FaHeart className="feature-icon" />,
      title: "Handcrafted With Love",
      description: "Each piece is meticulously crafted by our skilled artisans with attention to detail."
    },
    {
      icon: <FaUsers className="feature-icon" />,
      title: "10,000+ Happy Brides",
      description: "Join our community of satisfied brides who found their perfect wedding attire."
    },
    {
      icon: <FaRegSmile className="feature-icon" />,
      title: "Stress-Free Experience",
      description: "Personalized consultations to make your bridal shopping effortless and enjoyable."
    }
  ];

  return (
    <section className="why-us-section" id="why-us">
      <div className="why-us-container">
        <div className="section-header">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="title-decoration"></div>
          <p className="section-subtitle">
            We're dedicated to making your bridal experience unforgettable
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-item" key={index}>
              <div className="feature-icon-container">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="testimonial-section">
          <blockquote className="testimonial-quote">
            "The team understood exactly what I envisioned for my wedding day. 
            My dress was more beautiful than I could have imagined!"
          </blockquote>
          <p className="testimonial-author">— Priya Sharma, June Bride</p>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;