import Link from 'next/link'
import React from 'react'

const SideBar = () => {
  return (
    <aside className='sidebar'>
      <Link href="/hospital/dashboard" className='active'><i className="fa-regular fa-window-maximize"></i>Dashboard</Link>
      <Link href="/hospital/patients"><i className="fa-solid fa-user"></i>Patients</Link>
      <Link href="/hospital/services"><i className="fa-solid fa-clock"></i>Alerts</Link>
      <Link href="/hospital/contact"><i className="fa-solid fa-calendar"></i>Appointments</Link>
    </aside>
  )
}



export default SideBar