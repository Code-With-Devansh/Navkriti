"use client";
import React from 'react'
import { useEffect, useState } from 'react';
const Patient = ({params}) => {
  const [patient, setPatient] = useState({})
  useEffect(() => {
    const fetchPatient = async () => {
      const { id } = await params;
      try {
        const res = await fetch(`/api/admin/patients/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        });
        const data = await res.json();
        console.log(data.data)
        setPatient(data.data);
      } catch (err) {
        console.error("Error fetching patient:", err);
      }
    };
    fetchPatient();

  }, [])
return (
  <div>
    {Object.keys(patient).map((key) => (
      <p key={key}>
        {key}: {typeof patient[key] === "object" && patient[key] !== null
          ? JSON.stringify(patient[key])
          : patient[key]}
      </p>
    ))}
  </div>
);

}

export default Patient