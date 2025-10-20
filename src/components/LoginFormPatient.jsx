"use client";
import { redirect } from "next/navigation";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import Image from "next/image";

const LoginFormPatient = () => {
    const [isLogin, setLogin] = useState(false);
  return (
    isLogin ? redirect('/patient/dashboard') :
    <div className="form-container patient-login">
      <div className="left">
        <Image src={"/images/patient-loginpage.png"} fill={true} />
      </div>
      <div className="right">
        <h2>Patient Login</h2>
        <input type="number" placeholder="Enter your mobile number" />
        <input type="text" placeholder="Enter password" />
        <Link href={"/patient/dashboard"}>Login</Link>
      </div>
    </div>
  );
};

export default LoginFormPatient;
