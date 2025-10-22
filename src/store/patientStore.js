// store/patientStore.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";

const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [missedDosesMap, setMissedDosesMap] = useState({});
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(() => {
    if (!token) return; // wait until token exists

    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
        const [patientsRes, missedRes] = await Promise.all([
          fetch("/api/admin/patients", { headers }),
          fetch("/api/admin/patients/missed-doses", { headers })
        ]);
        const [patientsData, missedData] = await Promise.all([patientsRes.json(), missedRes.json()]);
        setPatients(patientsData?.data || []);
        setMissedDosesMap(missedData?.data || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <PatientContext.Provider value={{ patients, missedDosesMap, loading }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatients = () => useContext(PatientContext);
