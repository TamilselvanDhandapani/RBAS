import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "../../styles/About.css";

const images = [
  "https://images.pexels.com/photos/23623808/pexels-photo-23623808/free-photo-of-bride-and-bridesmaid-of-honor-holding-bouquets.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/27155546/pexels-photo-27155546/free-photo-of-portrait-of-smiling-woman-in-traditional-clothing.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/30685782/pexels-photo-30685782/free-photo-of-south-indian-bride-in-traditional-saree-smiling-outdoors.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/28512787/pexels-photo-28512787/free-photo-of-elegant-woman-in-chikankari-kurti-in-lucknow.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "https://images.pexels.com/photos/16803130/pexels-photo-16803130/free-photo-of-studio-shot-of-a-young-woman-wearing-a-pink-lehenga-dress.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
];

const services = [
  {
    title: "Bridal Gowns",
    description:
      "Indulge in our stunning bridal gowns crafted with precision and care. Each design reflects elegance and sophistication.",
  },
  {
    title: "Lehengas",
    description:
      "Traditional lehengas blending heritage with modern aesthetics for cultural charm.",
  },
  {
    title: "Sarees",
    description:
      "Exquisite sarees in a spectrum of colors, each a symbol of grace and tradition.",
  },
  {
    title: "Tops",
    description:
      "Trendy and chic tops to complement your bridal look with contemporary style.",
  },
  {
    title: "Cholis",
    description:
      "Intricately designed cholis to enhance the beauty of your outfit.",
  },
];

const About = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-left fade-in">
          <div className="swiper-container">
            <Swiper
              modules={[Pagination, Autoplay, EffectFade]}
              effect="fade"
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              loop
              speed={1000}
              className="about-swiper"
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            >
              {images.map((src, index) => (
                <SwiperSlide key={index}>
                  <div className="image-container">
                    <img
                      src={src}
                      alt={`Bridal Fashion ${index + 1}`}
                      loading="lazy"
                    />
                    <div className="image-overlay"></div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div className="about-right fade-in delay-1">
          <div className="about-content">
            <h2 className="about-section-title fade-in delay-1">
              Our Bridal Services
              <span className="about-title-decoration"></span>
            </h2>
            <p className="section-intro fade-in delay-2">
              Discover the perfect ensemble for your special day with our
              curated collection.
            </p>

            <div className="services-list">
              {services.map((service, index) => (
                <div
                  className={`service-item fade-in delay-${index + 2} ${
                    activeIndex === index ? "active-service" : ""
                  }`}
                  key={index}
                >
                  <div className="service-text">
                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-description">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="explore-btn-div fade-in delay-6">
              <Link to="/shopnow">
                <button className="explore-btn">Explore Now</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
