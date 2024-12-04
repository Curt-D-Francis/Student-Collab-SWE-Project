import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import TaskManagementSystem from "./TaskManagement";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Navigation Menu */}
      <nav className="navigation-menu">
        <h2>Menu</h2>
        <ul>
          <li>
            <Link to="/messages">Messaging</Link>
          </li>
          <li>
            <Link to="/projects">Projects</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
        </ul>
      </nav>

      <div className="dashboard-content">
        {/* Centered Header */}
        <header className="dashboard-header">
          <h1>Dashboard</h1>
        </header>

        <main className="dashboard-main">
          <section className="project-overview">
            <h2>Project Overview</h2>
            <p>Details about your projects will appear here.</p>
          </section>

          {/* Tasks Summary */}
          <section className="tasks-summary">
            <h2>Tasks Summary</h2>
            <ul className="tasks-list">
              <TaskManagementSystem />
            </ul>
          </section>

          {/* Notifications Panel */}
          <section className="notifications-panel">
            <h2>Notifications</h2>
            <ul className="notifications-list">
              <li>Task "Task 1" is due tomorrow!</li>
              <li>Message from Project Manager</li>
              <li>Task "Task 3" has been completed!</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
