// ECE 461L Software Lab
// Logan Liberty

import React, { useState } from "react";
import { Button, Card, CardContent, Typography, TextField, Box } from "@mui/material";

const API_BASE_URL = "http://localhost:5000";

const ProjectItemTab = ({ project, onJoinLeave}) => {
  const [qty, setQty] = useState(Array(project.hardware.length).fill(""));

  // Local hardware state
  const [hardwareState, setHardwareState] = useState(project.hardware);

  const handleInputChange = (index, value) => {
    const newQty = [...qty];
    const numericValue = value.replace(/[^0-9]/g, ''); // Allow only numbers
    newQty[index] = numericValue;
    setQty(newQty);
  };

  const handleCheckIn = async (hwIndex) => {
    if (!project.joined) return;
    const quantity = parseInt(qty[hwIndex], 10);
     if (!quantity || quantity <= 0) {
        alert("Please enter a valid quantity.");
        return;
     }

    const originalHwState = [...hardwareState];

    setHardwareState((prevHardware) =>
      prevHardware.map((hw, index) =>
        index === hwIndex ? { ...hw, out: Math.max(hw.out - quantity, 0) } : hw
      )
    );
    const tempQty = qty[hwIndex];
    setQty((prev) => prev.map((q, i) => (i === hwIndex ? "" : q)));

    try {
        const response = await fetch(`${API_BASE_URL}/checkin/${project.id}/${quantity}`, {
             method: "POST",
        });

        const result = await response.json();

        if (!response.ok) {
            setHardwareState(originalHwState);
            setQty((prev) => prev.map((q, i) => (i === hwIndex ? tempQty : q)));
            throw new Error(result.message || "Failed to check in hardware");
        }

        alert(result.message);

    } catch(error) {
        console.error("Check-in error:", error);
        alert(`Error: ${error.message}`);
         setHardwareState(originalHwState);
         setQty((prev) => prev.map((q, i) => (i === hwIndex ? tempQty : q)));
    }

  };

  const handleCheckOut = async (hwIndex) => {
    if (!project.joined) return;
     const quantity = parseInt(qty[hwIndex], 10);
     if (!quantity || quantity <= 0) {
        alert("Please enter a valid quantity.");
        return;
     }

     const originalHwState = [...hardwareState];
     const hwInfo = hardwareState[hwIndex];

      if (hwInfo.out + quantity > hwInfo.capacity) {
         alert("Check out quantity exceeds capacity.");
         return;
      }

    setHardwareState((prevHardware) =>
      prevHardware.map((hw, index) =>
        index === hwIndex ? { ...hw, out: hw.out + quantity } : hw
      )
    );
    const tempQty = qty[hwIndex];
    setQty((prev) => prev.map((q, i) => (i === hwIndex ? "" : q)));

     try {
        const response = await fetch(`${API_BASE_URL}/checkout/${project.id}/${quantity}`, {
            method: "POST",
        });

        const result = await response.json();

        if (!response.ok) {
            setHardwareState(originalHwState);
            setQty((prev) => prev.map((q, i) => (i === hwIndex ? tempQty : q)));
            throw new Error(result.message || "Failed to check out hardware");
        }

        alert(result.message);

    } catch(error) {
        console.error("Check-out error:", error);
        alert(`Error: ${error.message}`);
        setHardwareState(originalHwState);
        setQty((prev) => prev.map((q, i) => (i === hwIndex ? tempQty : q)));
    }
  };

  return (
    <Card
      variant="outlined"
      style={{
        border: "2px solid black",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        margin: "20px",
        padding: "15px",
        backgroundColor: project.joined ? "#dff0d8" : "#f5f5f5"
      }}
    >
      <CardContent>
        {/* Project name and users */}
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
          <Box style={{ flex: "1" }}>
            <Typography variant="h6">{project.name}</Typography>
             <Typography component="ul" variant="body2" style={{ paddingLeft: '20px', listStyle: 'disc' }}>
                 {project.users && project.users.length > 0 ? (
                    project.users.map((username, index) => (
                        <li key={index}>{username}</li>
                    ))
                 ) : (
                     <li>No users listed</li>
                 )}
             </Typography>
          </Box>
          <Button
            variant="contained"
            style={{
              backgroundColor: project.joined ? "red" : "green",
              color: "white",
            }}
            // Use the onJoinLeave passed from Projects component
            onClick={onJoinLeave}
          >
            {project.joined ? "Leave" : "Join"}
          </Button>
        </Box>

        {/* Use hardwareState for rendering since it's managed locally */}
        {hardwareState.map((hw, index) => (
          <Box
            key={index} // Using index as key is okay here if hardware list doesn't change order/length
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            paddingY={1}
            borderTop={index !== 0 ? "1px solid #ccc" : "none"}
          >
            {/* HW set name and values */}
            <Typography style={{ flex: "1" }}>{hw.name}: {hw.out}/{hw.capacity}</Typography>

            {/* Quantity input box */}
            <TextField
              label="Enter qty"
              variant="outlined"
              size="small"
              type="number" // Use type number
              value={qty[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              style={{ width: "100px", margin: "0 10px" }}
              disabled={!project.joined}
              inputProps={{ min: "1" }}
            />

            {/* Check in/out buttons */}
            <Box style={{ display: "flex", justifyContent: "flex-end", gap: "10px", minWidth: '220px' }}>
              <Button
                variant="contained"
                color="primary"
                // Call the modified local handler
                onClick={() => handleCheckIn(index)}
                 disabled={!project.joined || !qty[index] || hw.out === 0} // Disable if not joined, no qty, or nothing checked out
              >
                Check In
              </Button>
              <Button
                variant="contained"
                color="secondary"
                 // Call the modified local handler
                onClick={() => handleCheckOut(index)}
                disabled={!project.joined || !qty[index] || hw.out >= hw.capacity } // Disable if not joined, no qty, or already at capacity
              >
                Check Out
              </Button>
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProjectItemTab;
