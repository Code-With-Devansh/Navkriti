import React from "react";
import MedicineReminder from "@/components/MedicineReminder";
import PatientSideBar from "@/components/PatientSideBar";
import SOSBtn from "@/components/SOSBtn";
const DashBoardPatient = () => {
  return (
    <>
      <PatientSideBar active={"home"} />
      <div className="container" style={{ marginBottom: "150px" }}>
        <h1>Welcome back, Devesh!</h1>
        <p className="txt-light">How are you feeling today?</p>
        <div className="sos-btn-container">
          <SOSBtn />
        </div>
      </div>
    </>
  );
};

export default DashBoardPatient;
