import AppointmentCard from "@/components/AppointmentCard";
import PatientSideBar from "@/components/PatientSideBar";
import React from "react";

const CheckUps = () => {
  return (
    <div>
      <PatientSideBar active={"checkups"} />
      <div className="container introPara appointmentIntro">
        <div>
          <h2>Checkup Schedule</h2>
          <p className="txt-light">Manage your appointments</p>
          <div>
            <button className="book-appointment-btn">
              <i className="fa-regular fa-plus"></i>
              Book Appointment
            </button>
          </div>
        </div>

        <div className="appointmentList">
          <h3 className="appointmentListHeading">Upcoming Appointments</h3>
          <div className="appointments">

          <AppointmentCard
            patient={{
              name: "Devesh",
              med_history: [{ problem: "Dispression", doctor_name : "Devesh", dept: "Psychology" }],
            }}
          />
          <AppointmentCard
            patient={{
              name: "Devesh",
              med_history: [{ problem: "Dispression", doctor_name : "Devesh", dept: "Psychology" }],
            }}
          />
          <AppointmentCard
            patient={{
              name: "Devesh",
              med_history: [{ problem: "Dispression", doctor_name : "Devesh", dept: "Psychology" }],
            }}
          />
          <AppointmentCard
            patient={{
              name: "Devesh",
              med_history: [{ problem: "Dispression", doctor_name : "Devesh", dept: "Psychology" }],
            }}
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckUps;
