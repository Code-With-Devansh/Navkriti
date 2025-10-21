import AppointmentCard from "@/components/AppointmentCard";
import SideBar from "@/components/SideBar";
import React from "react";

const Appointments = () => {
  return (
    <div>
      <SideBar active={"appointments"} />
      <div className="container">
        <div className="introPara">
          <h2>Appointments</h2>
          <p className="txt-light">
            Manage patient appointments and appointments schedule
          </p>
        </div>

        <div className="complete-appointments-container">
          <div>
            <h3>
              <i className="fa-solid fa-calendar"></i> Jan 20,2025
            </h3>
          </div>
          <div className="appointments-container">
            <AppointmentCard />
            <AppointmentCard />
            <AppointmentCard />
          </div>
          <div className="complete-appointments-container">
            <h3>
              <i className="fa-solid fa-calendar"></i> Jan 21,2025
            </h3>
          </div>
          <div className="appointments-container">
            <AppointmentCard />
            <AppointmentCard />
            <AppointmentCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
