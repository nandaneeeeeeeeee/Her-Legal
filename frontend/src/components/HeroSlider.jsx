import { useState, useEffect } from "react";
import "./HeroSlider.css";

// Add more images here later — just import them and add to this array
function HeroSlider({ images }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000); // changes slide every 4 seconds
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="hero-slider">
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
            <span
              key={index}
              className={`dot ${index === current ? "active" : ""}`}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HeroSlider;