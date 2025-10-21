"use client";
import DashBoardCard from "@/components/DashBoardCard";
import SideBar from "@/components/SideBar";
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const DashBoardHospital = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    // Only run on client side
    if (!chartRef.current) return;

    // Destroy existing chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

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
          label: "Patient Checkups",
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: "#2563eb",
          tension: 0.1,
        },
      ],
    };

    // Create new chart instance
    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "line",
      data: data,
    });

    // Cleanup function
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <>
      <SideBar active="dashboard"/>
      <div className="container">
        <div className="dashboard-container">
          <h2>Dashboard</h2>
          <p>Welcome back, Hospital Administrator</p>
        </div>
        <div className="cards-container">
          <DashBoardCard
            title="Total Patients"
            count="238"
            iconClass="fa-user"
            lastPara="+5% from last week"
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
            <canvas ref={chartRef}></canvas>
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

export default DashBoardHospital;
