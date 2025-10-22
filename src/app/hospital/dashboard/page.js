"use client";
import React, { useRef, useMemo, useEffect } from "react";
import Chart from "chart.js/auto";
import DashBoardCard from "@/components/DashBoardCard";
import SideBar from "@/components/SideBar";
import { usePatients } from "@/store/patientStore";
import Link from "next/link";

const DashBoardHospital = () => {
  const [patientChangePercent, setPatientChangePercent] = React.useState(0);
  const { patients, missedDosesMap, loading } = usePatients();
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const today = new Date();
  const next7Days = new Date();
  next7Days.setDate(today.getDate() + 7);

  const { totalPatients, totalMissedDoses, alertType, totalUpcomingCheckups } =
    useMemo(() => {
      let totalMissed = 0;
      let alert = "low";

      // Total upcoming checkups in next 7 days
      let upcomingCheckups = 0;

      patients.forEach((p) => {
        // Missed doses calculation
        const recentIntakes = (p.medicine_intakes || [])
          .filter((i) => i?.scheduled_time)
          .sort(
            (a, b) => new Date(b.scheduled_time) - new Date(a.scheduled_time)
          )
          .slice(0, 15);

        let consecutiveMissed = 0;
        for (const intake of recentIntakes) {
          if (intake.status === "missed") consecutiveMissed++;
          else if (intake.status === "taken") break;
        }
        totalMissed += consecutiveMissed;

        // Alert logic
        const lastAlert =
          p.med_history?.[p.med_history.length - 1]?.alert?.toLowerCase() || "";
        if (
          (lastAlert === "high" && consecutiveMissed > 2) ||
          (lastAlert === "med" && consecutiveMissed > 5)
        )
          alert = "high";
        else if (lastAlert === "med" || consecutiveMissed > 0)
          alert = alert !== "high" ? "med" : alert;

        // Upcoming checkups in next 7 days
        upcomingCheckups += (p.med_history || []).filter((m) => {
          const f = new Date(m.followup);
          return f >= today && f <= next7Days;
        }).length;
      });

      return {
        totalPatients: patients.length,
        totalMissedDoses: totalMissed,
        alertType: alert,
        totalUpcomingCheckups: upcomingCheckups,
      };
    }, [patients]);
  const next7DaysData = useMemo(() => {
    const counts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);

    patients.forEach((p) => {
      (p.med_history || []).forEach((m) => {
        if (m.followup) {
          const followupDate = new Date(m.followup);
          if (followupDate >= today && followupDate <= next7Days) {
            const day = dayLabels[followupDate.getDay()];
            counts[day] += 1;
          }
        }
      });
    });

    // Return array in Mon–Sun order
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
      (d) => counts[d]
    );
  }, [patients]);

useEffect(() => {
  if (!chartRef.current) return;
  if (chartInstanceRef.current) chartInstanceRef.current.destroy();

  chartInstanceRef.current = new Chart(chartRef.current, {
    type: "line",
    data: {
      labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
      datasets: [
        {
          label: "Upcoming Checkups",
          data: next7DaysData,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.2)",
          tension: 0,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: { y: { beginAtZero: true, precision: 0 } }
    }
  });

  return () => chartInstanceRef.current?.destroy();
}, [next7DaysData]);

  // if (loading)
  //   return (
  //     <p style={{ textAlign: "center", padding: "40px" }}>
  //       Loading dashboard...
  //     </p>
  //   );

  return (
    <>
      <SideBar active="dashboard" />
      <div className="container">
        <div className="dashboard-container">
          <h2>Dashboard</h2>
          <p>Welcome back, Hospital Administrator</p>
        </div>

        <div className="cards-container">
          <Link href="/hospital/patients">
            <DashBoardCard
              title="Total Patients"
              count={totalPatients}
              iconClass="fa-user"
              lastPara={`+${patientChangePercent}% from last week`}
            />
          </Link>
          <Link href="/hospital/patients">
            <DashBoardCard
              title="Missed Doses"
              count={totalMissedDoses}
              color={
                alertType === "high"
                  ? "red"
                  : alertType === "med"
                  ? "orange"
                  : "black"
              }
              iconClass="fa-solid fa-bell"
              lastPara={`Alert Level: ${alertType.toUpperCase()}`}
            />
          </Link>
          <Link href="/hospital/alerts">
            <DashBoardCard
              title="Active Alerts"
              count="5"
              color="red"
              iconClass="fa-solid fa-info"
              lastPara="Urgent Action required"
            />
          </Link>
          <Link href="/hospital/appointments">
            <DashBoardCard
              title="Upcoming Checkups"
              count={totalUpcomingCheckups}
              iconClass="fa-calendar"
              lastPara="Next 7 days"
            />
          </Link>
        </div>

        <div className="visual-section">
          <div className="graph-container">
            <h2>Patient Checkups - Weekly Overview</h2>
            <canvas ref={chartRef}></canvas>
          </div>

          <div className="recent-notifcation-container">
            <h2>Recent Notifications</h2>
            <ul>
              <li className="emergency">
                SOS alert from Devesh Sharma.<p>2 min ago</p>
              </li>
              <li>
                3 patients missed their medication today.<p>1 hour ago</p>
              </li>
              <li>
                New appointments scheduled for tomorrow.<p>3 hours ago</p>
              </li>
              <li className="emergency">
                Vital signs alert for patient Rina Patel.<p>5 hours ago</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoardHospital;
