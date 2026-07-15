import { useState, useEffect } from "react";
import "./HeroSlider.css";

function HeroSlider({ images }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="hero-slider">
      <div className="slider-overlay" />
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Hero slide ${index + 1}`}
          className={`slide ${index === current ? "active" : ""}`}
        />
      ))}

      {images.length > 1 && (
        <div className="slider-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === current ? "active" : ""}`}
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HeroSlider;
