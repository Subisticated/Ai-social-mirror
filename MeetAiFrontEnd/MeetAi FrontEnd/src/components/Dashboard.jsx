import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Welcome to Your Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card summarizer">
          <h2>Summarizer</h2>
          <p>
            Get concise summaries of your meetings with key points and action
            items.
          </p>
        </div>
        <div className="dashboard-card calendar">
          <h2>Calendar</h2>
          <p>View and manage your upcoming meetings and events.</p>
        </div>
        <div className="dashboard-card meet-attend">
          <h2>Meet Attendance</h2>
          <p>Track participant engagement and attendance in your meetings.</p>
        </div>
        <div className="dashboard-card scheduler">
          <h2>Scheduler</h2>
          <p>Plan and schedule your meetings efficiently with AI assistance.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
