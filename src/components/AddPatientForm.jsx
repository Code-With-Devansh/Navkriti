


"use client";
import React, { useState } from "react";
import Image from "next/image";
import PatientRegister from "./PatientRegister";
const AddPatient = () => {

  return (
    <div className="form-container patient-register-container">
      <div className="right">
        <PatientRegister/>
      </div>
    </div>
  );
};

export default AddPatient;

