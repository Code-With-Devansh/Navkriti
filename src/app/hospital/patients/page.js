"use client";
import SideBar from "@/components/SideBar";
import React, { use, useState, useEffect } from "react";
import styles from "./patients.module.css";
import PatientCard from "@/components/PatientCard";

const Patients = () => {
  const [patients, Setpatients] = useState([]);
  useEffect(() => {
    //fetch patients from api and set to state
    const fetchTotalPatients = async () => {
      try {
        const response = await fetch("/api/admin/patients", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        Setpatients(data.data || []);
      } catch (error) {
        console.error("Error fetching total patients:", error);
      }
    };
    fetchTotalPatients();
  }, []);

  return (
    <div>
      <SideBar active={"patients"} />
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div>
            <h2 className={styles.header}>Patients</h2>
            <p className={styles.subIntro}>Manage and monitor patient care</p>
          </div>
          <div>
            <div className={styles.searchBox}>
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Search patients"
                name="patient_name"
                id="patient_name"
                className={styles.searchInput}
              />
            </div>
          </div>
        </div>

        <div className="container">
          <div className="patient-container">
            {patients.map((patient) => {
              let follow_up = null;

              patient.med_history.forEach((e) => {
                const followupDate = new Date(e.followup);
                if (followupDate >= new Date()) {
                  if (follow_up === null || followupDate < follow_up) {
                    follow_up = followupDate;
                  }
                }
              });

              return (
                <PatientCard
                  key={patient._id} // always add a key when mapping
                  name={patient.name}
                  age={patient.age}
                  follow_up={patient.med_history.length > 0 ? follow_up:"N/A"}
                  condition = {patient.med_history.length > 0 ? patient.med_history[patient.med_history.length - 1].problem : "N/A"}
                  missed_doses = {0}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;
