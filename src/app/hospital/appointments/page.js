"use client";

import AppointmentCard from "@/components/AppointmentCard";
import SideBar from "@/components/SideBar";
import React, { useEffect, useState } from "react";

const Appointments = () => {
  const [patients, setPatients] = useState([]);
  const [appointmentsByDate, setAppointmentsByDate] = useState({});

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch("/api/admin/patients", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setPatients(data.data || []);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    const grouped = {};
    patients.forEach((patient) => {
      let nextFollowUp = null;

      patient.med_history.forEach((record) => {
        const followupDate = new Date(record.followup);
        if (followupDate >= new Date()) {
          if (!nextFollowUp || followupDate < nextFollowUp) {
            nextFollowUp = followupDate;
          }
        }
      });

      if (nextFollowUp) {
        const key = nextFollowUp.toISOString().split("T")[0];
        grouped[key] = [...(grouped[key] || []), patient];
      }
    });
    setAppointmentsByDate(grouped);
  }, [patients]);

  // Sort dates descending (latest first)
  const sortedDates = Object.keys(appointmentsByDate).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  return (
    <div>
      <SideBar active="appointments" />
      <div className="container">
        <div className="introPara">
          <h2>Appointments</h2>
          <p className="txt-light">
            Manage patient appointments and appointment schedules
          </p>
        </div>

        <div className="complete-appointments-container">
          {sortedDates.length === 0 && <p>No Appointments Scheduled</p>}

          {sortedDates.map((date) => (
            <div key={date}>
              <h3>
                <i className="fa-solid fa-calendar"></i>{" "}
                {new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </h3>

              <div className="appointments-container">
                {appointmentsByDate[date].map((patient) => (
                  <AppointmentCard key={patient._id} patient={patient} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
