import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { useSwipeable } from "react-swipeable";
import AOS from "aos";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "aos/dist/aos.css";
import "../../styles/Home.css";

import img1 from "../../assets/images/1.jpg";
import img2 from "../../assets/images/2.jpg";
import img3 from "../../assets/images/3.jpg";
import img4 from "../../assets/images/4.jpg";
import img5 from "../../assets/images/5.jpg";
import img6 from "../../assets/images/6.jpg";
import img7 from "../../assets/images/7.jpg";
import img8 from "../../assets/images/8.jpg";
import img9 from "../../assets/images/9.jpg";

const heroSlides = [
  { image: img1, title: "Elegant Lehankas", description: "Graceful styles for your perfect day." },
  { image: img2, title: "Charming Cholis", description: "Bold, vibrant, and stunning." },
  { image: img3, title: "Trendy Tops", description: "Modern looks for everyday glam." },
  { image: img4, title: "Silk Sarees", description: "Traditional elegance reimagined." },
  { image: img5, title: "Designer Gowns", description: "Red carpet ready silhouettes." },
  { image: img6, title: "Wedding Wear", description: "Unveil your bridal dreams." },
  { image: img7, title: "Festive Fashion", description: "Celebrate in style." },
  { image: img8, title: "Statement Styles", description: "Own the moment, boldly." },
  { image: img9, title: "Daily Essentials", description: "Comfy and stylish everyday wear." },
];

const categories = [
  { name: "Lehankas", path: "/lehankas", class: "cat-lehankas" },
  { name: "Cholis", path: "/choli", class: "cat-cholis" },
  { name: "Tops", path: "/tops", class: "cat-tops" },
  { name: "Sarees", path: "/sarees", class: "cat-sarees" },
  { name: "Gown", path: "/gown", class: "cat-gown" },
];

const splitText = (text) =>
  text.split(" ").map((word, i) => (
    <span key={i} className="word-fade">
      {word}&nbsp;
    </span>
  ));

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleGetStarted = () => {
    navigate(user ? "/shopnow" : "/register");
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => navigate("/next"),
    onSwipedRight: () => navigate("/previous"),
  });

  return (
    <div className="home-wrapper">
      {/* Hero Swiper */}
      <section className="hero-content-one">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000 }}
          loop={true}
          className="hero-swiper"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="hero-slide">
                <img src={slide.image} alt={slide.title} className="hero-image" />
                <div className="overlay-text improved-overlay">
                  <h2 className="hero-title">{splitText(slide.title)}</h2>
                  <p className="hero-description">{splitText(slide.description)}</p>
                  <button className="get-started-btn" onClick={handleGetStarted}>
                    Get Started
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Categories with Swipe Gesture */}
      <section className="categories-section" {...swipeHandlers}>
        <h2 className="categories-heading">✨ Explore Categories</h2>
        <div className="categories-grid">
          {categories.map((cat, index) => (
            <Link
              to={cat.path}
              className={`category-card ${cat.class}`}
              key={index}
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
