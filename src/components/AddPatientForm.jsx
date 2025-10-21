"use client";
import React, { useState } from "react";
import PatientRegister from "./PatientRegister";
import SideBar from "./SideBar";
const AddPatient = () => {

  return (
    <div className="form-container patient-register-container">
      <SideBar active={"add patient"} />
      <div className="right">
        <PatientRegister/>
      </div>
    </div>
  );
};

export default AddPatient;

