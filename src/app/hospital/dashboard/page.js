"use client";
import React, { useRef, useMemo, useEffect } from "react";
import Chart from "chart.js/auto";
import DashBoardCard from "@/components/DashBoardCard";
import SideBar from "@/components/SideBar";
import { usePatients } from "@/store/patientStore";

const DashBoardHospital = () => {
  const { patients, missedDosesMap, loading } = usePatients();
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const { totalPatients, totalMissedDoses, alertType } = useMemo(() => {
    let total = 0;
    let alert = "low";

    patients.forEach((p) => {
      const recentIntakes = (p.medicine_intakes || [])
        .filter(i => i?.scheduled_time)
        .sort((a, b) => new Date(b.scheduled_time) - new Date(a.scheduled_time))
        .slice(0, 15);

      let missed = 0;
      for (const intake of recentIntakes) {
        if (intake.status === "missed") missed++;
        else if (intake.status === "taken") break;
      }

      total += missed;

      const lastAlert = p.med_history?.[p.med_history.length - 1]?.alert?.toLowerCase() || "";
      if ((lastAlert === "high" && missed > 2) || (lastAlert === "med" && missed > 5)) alert = "high";
      else if (lastAlert === "med" || missed > 0) alert = alert !== "high" ? "med" : alert;
    });

    return { totalPatients: patients.length, totalMissedDoses: total, alertType: alert };
  }, [patients]);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{ label: "Patient Checkups", data: [65, 59, 80, 81, 56, 55, 40], borderColor: "#2563eb", tension: 0.1 }]
      },
    });

    return () => chartInstanceRef.current?.destroy();
  }, []);

  // if (loading) return <p style={{ textAlign: "center", padding: "40px" }}>Loading dashboard...</p>;

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
          <DashBoardCard
            title="Missed Doses"
            count={totalMissedDoses}
            color={alertType === "high" ? "red" : alertType === "med" ? "orange" : "black"}
            iconClass="fa-solid fa-bell"
            lastPara={`Alert Level: ${alertType.toUpperCase()}`}
          />
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
