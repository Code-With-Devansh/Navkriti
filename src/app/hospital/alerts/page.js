"use client";
import React, { useEffect } from "react";
import AlertCard from "@/components/AlertCard";
import ResolvedAlertCard from "@/components/ResolvedAlertCard";
import SideBar from "@/components/SideBar";
import { usePatients } from "@/store/patientStore"; // alerts now come from here

const Alerts = () => {
  const { alerts, setAlerts, refreshAlerts, setRefreshAlerts } = usePatients();

  // Fetch alerts only if not already fetched, or when refreshAlerts changes
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    const fetchAlerts = async () => {
      try {
        const response = await fetch("/api/alerts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setAlerts(data || []);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

    fetchAlerts();
  }, [refreshAlerts, setAlerts]);

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days !== 1 ? "s" : ""}`;
    if (hours > 0) return `${hours} hour${hours !== 1 ? "s" : ""}`;
    if (minutes > 0) return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    return `${seconds} second${seconds !== 1 ? "s" : ""}`;
  };

  const pendingAlerts = alerts.filter((a) => a.status === "pending");
  const resolvedAlerts = alerts.filter((a) => a.status !== "pending");

  return (
    <div>
      <SideBar active={"alerts"} />
      <div className="container">
        <div className="introPara">
          <h2>Alerts Page</h2>
          <p className="txt-light">Monitor and manage patient alerts</p>
        </div>

        <div>
          <h2>
            Active alerts{" "}
            <span className="missed-doses-text">{pendingAlerts.length}</span>
          </h2>
          {alerts.length === 0 && <p>No alerts found.</p>}

          {pendingAlerts.map((alert) => (
            <AlertCard
              key={alert._id}
              alertype={alert.alert_type}
              alert_id={alert._id}
              patient_id={alert.patient_id}
              iconClassName="fa-circle-info"
              className="emergency-card"
              patient_name={alert.patient_name}
              message={alert.category}
              time={formatDuration(new Date() - new Date(alert.createdAt))}
              setRefresh={setRefreshAlerts}
            />
          ))}
        </div>

        {resolvedAlerts.length > 0 && (
          <div>
            <h2>
              Resolved alerts{" "}
              <span className="resolved-alert-text">{resolvedAlerts.length}</span>
            </h2>
            {resolvedAlerts.map((alert) => (
              <ResolvedAlertCard
                key={alert._id}
                alertype={alert.alert_type}
                alert_id={alert._id}
                iconClassName="fa-thumbs-up"
                className="doses-missed-card"
                patient_name={alert.patient_name}
                message={alert.category}
                time={formatDuration(new Date() - new Date(alert.createdAt))}
                setRefresh={setRefreshAlerts}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
