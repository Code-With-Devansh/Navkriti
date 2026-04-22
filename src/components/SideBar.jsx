"use client";
import Link from 'next/link';
import React, { useState } from 'react';

const SideBar = ({ active }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSideBar = () => {
    setIsOpen(!isOpen);
  };

  const links = [
    {
      href: "/hospital/dashboard",
      iconClass: "fa-window-maximize",
      label: "Dashboard",
    },
    {
      href: "/hospital/patients",
      iconClass: "fa-user",
      label: "Patients",
    },
    {
      href: "/hospital/alerts",
      iconClass: "fa-clock",
      label: "Alerts",
    },
    {
      href: "/hospital/appointments",
      iconClass: "fa-calendar",
      label: "Appointments",
    },
    {
      href: "/hospital/add-patient",
      iconClass: "fa-plus",
      label: "Add Patient"
    }
  ];

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} id='sidebar'>
        {
          links.map((link, index) => (
            link.label.toLowerCase() !== active ?
              <Link href={link.href} key={index}><i className={"fa-regular " + link.iconClass}></i>{link.label}</Link> : <Link href={link.href} key={index} className='active'><i className={"fa-regular " + link.iconClass}></i>{link.label}</Link>
          ))
        }
      </aside>
      <button className='menu' id="menu" onClick={toggleSideBar}>
        <div></div>
        <div></div>
        <div></div>
      </button>
    </>
  );
};



export default SideBar