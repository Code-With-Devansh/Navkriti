"use client";
import DashBoardCard from "@/components/DashBoardCard";
import SideBar from "@/components/SideBar";
import React, { useEffect, useState } from "react";

const DashBoardHospital = () => {
  const [totalPatients, setTotalPatients] = useState(0);
  useEffect(() => {
    // Fetch total patients from API
    const fetchTotalPatients = async () => {
      try {
        const response = await fetch("/api/admin/patients", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data);
        setTotalPatients(data.data.length || 0);
      } catch (error) {
        console.error("Error fetching total patients:", error);
      }
    };
    fetchTotalPatients();
  }, []);
  return (
    <>
      <SideBar />
      <div className="container">
        <div className="dashboard-container">
          <h2>Dashboard</h2>
          <p>Welcome back, Hospital Administrator</p>
        </div>
        <div className="cards-container">
          <DashBoardCard
            title="Total Patients"
            count={totalPatients}
            iconClass="fa-user"
          />
          <DashBoardCard
            title="Missed Doses"
            count="12"
            color="red"
            iconClass="fa-solid fa-bell"
            lastPara="Requires action"
          />
          <DashBoardCard
            title="Active Alerts"
            count="5"
            color="red"
            iconClass="fa-solid fa-info"
            lastPara="Urgent Action required"
          />
          <DashBoardCard
            title="Upcoming Checkups"
            count="34"
            iconClass="fa-calendar"
            lastPara="Next 7 dats"
          />
        </div>
        <div className="visual-section">
          <div className="graph-container">
            <h2>Patient Checkups - Weekly Overview</h2>
            <canvas id="graph"></canvas>
          </div>
          <div className="recent-notifcation-container">
            <h2>Recent Notifications </h2>
            <ul>
              <li className="emergency">
                SOS alert from Devesh Sharma.
                <br />
                <p>2min ago</p>
              </li>
              <li>
                3 patients missed their medication today.
                <br />
                <p>1 hour ago</p>
              </li>
              <li>
                New appointments scheduled for tomorrow.
                <br />
                <p>3 hours ago</p>
              </li>
              <li className="emergency">
                Vital signs alert for patient Rina Patel.
                <br />
                <p>5 hours ago</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

import Chart from "chart.js/auto";
import { set } from "mongoose";

(async function () {
  const data = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        label: "My First Dataset",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  new Chart(document.getElementById("graph"), {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Patient Checkups",
          data: data.datasets[0].data,
        },
      ],
    },
  });
})();

export default DashBoardHospital;
