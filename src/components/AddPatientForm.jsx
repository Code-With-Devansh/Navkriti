"use client";
import React, { useState } from "react";
import Image from "next/image";

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
        <h2>Patient Register</h2>

        <form>
          <input
            type="text"
            name="patient_name"
            placeholder="Enter patient name"
            required
          />
          <input
            type="text"
            name="ph_number"
            placeholder="Enter patient mobile number"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            required
          />

          <button
            type="submit"
          >
            Add Patient
          </button>
        </form>

      </div>
    </div>
  );
};

export default AddPatient;

