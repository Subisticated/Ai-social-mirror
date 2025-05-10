import React from "react";
import "./FeaturesSection.css";

const features = [
  {
    title: "Automatic Meeting Summarization",
    description:
      "AI listens, understands, and condenses discussions into concise summaries.",
  },
  {
    title: "Minute-by-Minute Breakdown",
    description:
      "Detailed timestamps for important moments, ensuring users never miss crucial information.",
  },
  {
    title: "Deep Participant Analysis",
    description:
      "Tracks engagement, concentration levels, posture, and tone shifts to evaluate meeting dynamics.",
  },
  {
    title: "Tone & Sentiment Analysis",
    description:
      "AI detects emotional shifts in conversation, ensuring users understand subtle nuances.",
  },
  {
    title: "Posture Analysis",
    description:
      "AI assesses body language and physical engagement levels for deeper insights.",
  },
  {
    title: "Personalized Meeting Reports",
    description:
      "Understand personal interaction patterns, speaking efficiency, and behavioral trends.",
  },
  {
    title: "Multi-modal AI Processing",
    description:
      "Seamlessly integrates audio, video, and behavioral cues for comprehensive insights.",
  },
  {
    title: "Smart Recommendations",
    description:
      "AI suggests improvements for future meetings, making interactions more productive.",
  },
];

const FeaturesSection = () => {
  return (
    <div className="features-section">
      <h2>Features</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
