"use client";
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import DashBoardCard from "@/components/DashBoardCard";
import SideBar from "@/components/SideBar";

const DashBoardHospital = () => {
  const [totalPatients, setTotalPatients] = useState(0);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const fetchTotalPatients = async () => {
      try {
        const response = await fetch("/api/admin/patients", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setTotalPatients(data.data.length || 0);
      } catch (error) {
        console.error("Error fetching total patients:", error);
      }
    };
    fetchTotalPatients();
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Patient Checkups",
            data: [65, 59, 80, 81, 56, 55, 40],
            borderColor: "#2563eb",
            tension: 0.1,
          },
        ],
      },
    });

    return () => chartInstanceRef.current?.destroy();
  }, []);

  return (
    <>
      <SideBar active="dashboard" />
      <div className="container">
        <div className="dashboard-container">
          <h2>Dashboard</h2>
          <p>Welcome back, Hospital Administrator</p>
        </div>

        <div className="cards-container">
          <DashBoardCard title="Total Patients" count={totalPatients} iconClass="fa-user" />
          <DashBoardCard title="Missed Doses" count="12" color="red" iconClass="fa-solid fa-bell" lastPara="Requires action" />
          <DashBoardCard title="Active Alerts" count="5" color="red" iconClass="fa-solid fa-info" lastPara="Urgent Action required" />
          <DashBoardCard title="Upcoming Checkups" count="34" iconClass="fa-calendar" lastPara="Next 7 days" />
        </div>

        <div className="visual-section">
          <div className="graph-container">
            <h2>Patient Checkups - Weekly Overview</h2>
            <canvas ref={chartRef}></canvas>
          </div>

          <div className="recent-notifcation-container">
            <h2>Recent Notifications</h2>
            <ul>
              <li className="emergency">SOS alert from Devesh Sharma.<p>2 min ago</p></li>
              <li>3 patients missed their medication today.<p>1 hour ago</p></li>
              <li>New appointments scheduled for tomorrow.<p>3 hours ago</p></li>
              <li className="emergency">Vital signs alert for patient Rina Patel.<p>5 hours ago</p></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoardHospital;
