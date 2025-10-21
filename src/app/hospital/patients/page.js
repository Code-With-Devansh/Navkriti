import SideBar from "@/components/SideBar";
import React from "react";
import styles from "./patients.module.css";
import PatientCard from "@/components/PatientCard";

const Patients = () => {
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
            <PatientCard />
            <PatientCard />
            <PatientCard />
            <PatientCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patients;
