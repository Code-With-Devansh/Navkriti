"use client";
import AlertCard from "@/components/AlertCard";
import ResolvedAlertCard from "@/components/ResolvedAlertCard";
import SideBar from "@/components/SideBar";
import React, { useEffect } from "react";

const Alerts = () => {
  const [alerts, setAlerts] = React.useState([]);
  const [refresh, setRefresh] = React.useState(false);
  const [changealert, setChangealert] = React.useState({message:"", color:""});
  useEffect(() => {
    // Fetch alerts from the API
    const fetchAlerts = async () => {
      try {
        const response = await fetch("/api/alerts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
        const data = await response.json();
        setAlerts(data);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };
    fetchAlerts();
  }, [refresh]);
  function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days !== 1 ? "s" : ""}`;
    if (hours > 0) return `${hours} hour${hours !== 1 ? "s" : ""}`;
    if (minutes > 0) return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    return `${seconds} second${seconds !== 1 ? "s" : ""}`;
  }

  return (
    <div>
      <SideBar active={"alerts"} />
      <div className="container">
        <div className="introPara">
          <h2>Alerts Page</h2>
          <p className="txt-light">Monitor and manage patient alerts</p>
        </div>
        <div>
          {changealert.message!=="" && <p className={`text-${changealert.color}`}>{changealert.message}</p>}
          <h2>
            Active alerts{" "}
            <span className="missed-doses-text">
              {alerts.filter((a) => a.status === "pending").length}
            </span>
          </h2>
          {alerts.length === 0 && <p>No alerts found.</p>}
          {alerts.map((alert) => {
            // divide on based of status

            if (alert.status !== "pending") return null;
            return (
              <AlertCard
                alertype={alert.alert_type}
                alert_id={alert._id}
                patient_id={alert.patient_id}
                iconClassName="fa-circle-info"
                className={"emergency-card"}
                patient_name={alert.patient_name}
                message={alert.category}
                time={formatDuration(new Date() - new Date(alert.createdAt))}
                key={alert._id}
                setRefresh={setRefresh}
                setChangealert={setChangealert}
              />
            );
          })}
        </div>

        <div>
          {alerts.filter((a) => a.status !== "pending").length > 0 && (
            <h2>
              Resolved alerts{" "}
              <span className="resolved-alert-text">
                {alerts.filter((a) => a.status !== "pending").length}
              </span>
            </h2>
          )}
          {alerts
            .filter((a) => a.status !== "pending")
            .map((alert) => {
              // divide on based of status
              return <ResolvedAlertCard
                alertype={alert.alert_type}
                alert_id={alert._id}
                iconClassName="fa-thumbs-up"
                className={"doses-missed-card"}
                patient_name={alert.patient_name}
                message={alert.category}
                time={formatDuration(new Date() - new Date(alert.createdAt))}
                key={alert._id}
                setRefresh={setRefresh}
                setChangealert={setChangealert}
              />;
            })}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
