import React from "react";
import "./HeroSection.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ShootingStars from "./ShootingStars";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="hero-section"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
    >
      <ShootingStars />
      <h1>Welcome to MeetAi</h1>
      <p>
        Transform your meetings with cutting-edge AI technology. From automatic
        summarization to deep participant analysis, MeetAi ensures you get the
        most out of every discussion.
      </p>
      <div className="hero-buttons">
        <motion.button
          className="btn-primary"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/login")}
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  );
};

export default HeroSection;
