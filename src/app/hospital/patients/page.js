"use client";
import SideBar from "@/components/SideBar";
import React, { useState, useEffect } from "react";
import styles from "./patients.module.css";
import PatientCard from "@/components/PatientCard";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [missedDosesMap, setMissedDosesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPatientsAndMissedDoses();
  }, []);

  const fetchPatientsAndMissedDoses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      // Fetch patients
      const patientsResponse = await fetch("/api/admin/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const patientsData = await patientsResponse.json();

      // Fetch missed doses for all patients
      const missedDosesResponse = await fetch("/api/admin/patients/missed-doses", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const missedDosesData = await missedDosesResponse.json();

      if (patientsData.success) {
        setPatients(patientsData.data || []);
      }

      if (missedDosesData.success) {
        setMissedDosesMap(missedDosesData.data || {});
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.ph_number.toString().includes(searchTerm)
  );

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="container">
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <p>Loading patients...</p>
            </div>
          ) : (
            <div className="patient-container">
              {filteredPatients.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <p>No patients found</p>
                </div>
              ) : (
                filteredPatients.map((patient) => {
                  let follow_up = null;

                  // Find the nearest upcoming follow-up date
                  patient.med_history.forEach((e) => {
                    if (e.followup) {
                      const followupDate = new Date(e.followup);
                      if (followupDate >= new Date()) {
                        if (follow_up === null || followupDate < follow_up) {
                          follow_up = followupDate;
                        }
                      }
                    }
                  });

                  // Get missed doses count for this patient
                  const missedDoses = missedDosesMap[patient._id] || 0;

                  // Get the most recent condition/problem
                  const condition = patient.med_history.length > 0 
                    ? patient.med_history[patient.med_history.length - 1].problem 
                    : "N/A";

                  return (
                    <PatientCard
                      key={patient._id}
                      id={patient._id}
                      name={patient.name}
                      age={patient.age}
                      sex={patient.sex}
                      phone={patient.ph_number}
                      follow_up={follow_up ? follow_up.toLocaleDateString() : "N/A"}
                      condition={condition}
                      missed_doses={missedDoses}
                    />
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Patients;