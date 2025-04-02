// ECE 461L Software Lab
// Logan Liberty

import React, { useState } from "react";
import ProjectItemTab from "./ProjectItemTab"
import { Typography } from "@mui/material";

// Define the base URL for backend
const API_BASE_URL = "http://localhost:5000";

const Projects = () => {
    const [projects, setProjects] = useState([
      { id: 1, name: "Project Name 1", users: ["list", "of", "authorized", "users",], hardware: [{ name: "HWSet1", capacity: 100, out: 0}, { name: "HWSet2", capacity: 100, out: 0},], joined: false, },
      { id: 2, name: "Project Name 2", users: ["list", "of", "authorized", "users",], hardware: [{ name: "HWSet1", capacity: 100, out: 0}, { name: "HWSet2", capacity: 100, out: 0},], joined: false, },
      { id: 3, name: "Project Name 3", users: ["list", "of", "authorized", "users",], hardware: [{ name: "HWSet1", capacity: 100, out: 0}, { name: "HWSet2", capacity: 100, out: 0},], joined: false, },
    ]);

  const handleJoinLeave = async (id) => {
      const project = projects.find(p => p.id === id);
      if (!project) return;

      const action = project.joined ? "leave" : "join";
      const originalJoinedState = project.joined;

      setProjects(prevProjects =>
          prevProjects.map(p =>
              p.id === id ? { ...p, joined: !originalJoinedState } : p
          )
      );
      // ------------------------------------------------------------------------

      try {
          const response = await fetch(`${API_BASE_URL}/${action}/${id}`, {
              method: "POST",
              headers: {
                  'Content-Type': 'application/json',
              }
          });

          const result = await response.json(); // Get the message from backend

          if (!response.ok) {
              setProjects(prevProjects =>
                  prevProjects.map(p =>
                      p.id === id ? { ...p, joined: originalJoinedState } : p
                  )
              );
              throw new Error(result.message || `Failed to ${action} project`);
          }

          // On success, show the message from the backend
          alert(result.message);

      } catch (error) {
          console.error(`Error ${action}ing project:`, error);
          alert(`Error: ${error.message}`);
           setProjects(prevProjects =>
              prevProjects.map(p =>
                  p.id === id ? { ...p, joined: originalJoinedState } : p
              )
          );
      }
  };

  const handleCheckIn = (projectId, hwIndex, quantity) => {
    console.log(`Placeholder: Check In ${quantity} of HW index ${hwIndex} for project ${projectId}`);
    // Actual API call logic will be triggered within ProjectItemTab
  };

  const handleCheckOut = (projectId, hwIndex, quantity) => {
    console.log(`Placeholder: Check Out ${quantity} of HW index ${hwIndex} for project ${projectId}`);
     // Actual API call logic will be triggered within ProjectItemTab
  };


  return (
    <div>
      <Typography variant="h4" style={{ marginBottom: "20px" }}>Projects</Typography>
      {projects.map(project => (
        <ProjectItemTab
            key={project.id}
            project={project}
            onJoinLeave={() => handleJoinLeave(project.id)}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
        />
      ))}
    </div>
  );
};

export default Projects;
