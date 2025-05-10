import React from "react";
import "./ShootingStars.css";

const ShootingStars = () => {
  return (
    <div className="shooting-stars">
      {[...Array(50)].map((_, i) => {
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        const randomDelay = Math.random() * 5;
        const randomDuration = 2 + Math.random() * 3;
        return (
          <div
            key={i}
            className="star"
            style={{
              top: `${randomY}%`,
              left: `${randomX}%`,
              animation: `shoot ${randomDuration}s linear ${randomDelay}s infinite`,
            }}
          ></div>
        );
      })}
    </div>
  );
};

export default ShootingStars;
