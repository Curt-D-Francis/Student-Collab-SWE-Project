import React from "react";
import { Link, useNavigate } from "react-router-dom"; 
import supabase from "../config/supabaseClient";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      console.log("User logged out");
      navigate("/");  // goes back to LoginPage after logout
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Navigation Menu */}
      <nav className="navigation-menu">
        <h2>Menu</h2>
        <ul>
          <li><Link to="/messages">Messaging</Link></li>
          <li><Link to="/projects">Projects</Link></li>
          <li><Link to="/settings">Settings</Link></li>
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
              <li>
                <span>Task 1</span>
                <span className="status pending">Pending</span>
              </li>
              <li>
                <span>Task 2</span>
                <span className="status in-progress">In Progress</span>
              </li>
              <li>
                <span>Task 3</span>
                <span className="status completed">Completed</span>
              </li>
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

          {/* Logout button */}
          <div className="logout-container"> 
            <button onClick={handleLogout} className="btn logout-btn">
              Logout
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
