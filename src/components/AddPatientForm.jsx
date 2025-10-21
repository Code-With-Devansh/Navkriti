


"use client";
import React, { useState } from "react";
import Image from "next/image";
import PatientRegister from "./PatientRegister";
const AddPatient = () => {

  return (
    <div className="form-container patient-login">
      <div className="left">
        <Image
          src="/images/patient-loginpage.png"
          fill={true}
          alt="Patient Register"
          priority
          objectFit="contain"
        />
      </div>
      <div className="right">
        <PatientRegister/>

      </div>
    </div>
  );
};

export default AddPatient;

