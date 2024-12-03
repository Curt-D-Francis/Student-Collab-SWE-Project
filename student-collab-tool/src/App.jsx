import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import AdminPage from "./pages/AdminPage";
import StudentPage from "./pages/StudentPage";
import Dashboard from "./components/Dashboard"; // New Dashboard
import MessageComponent from "./components/MessageComponent";
import ProjectComponent from "./components/ProjectComponent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/student" element={<StudentPage />} />
        <Route
          path="/messages"
          element={
            <>
              <MessageComponent
                projectId="test-project-1"
                currentUser="JohnDoe"
              />{" "}
              <MessageComponent
                projectId="test-project-1"
                currentUser="JaneDoe"
              />
            </>
          }
        />
        <Route path="/projects" element={<ProjectComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
