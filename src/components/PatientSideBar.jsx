import Link from 'next/link'
import React from 'react'

const PatientSideBar = ({ active }) => {
    const links = [
        {
            href: "/patient/dashboard",
            iconClass: "fa-home",
            label: "Home",
        },
        {
            href: "/patient/medicines",
            iconClass: "fa-solid fa-capsules",
            label: "Medicines",
        },
        {
            href: "/patient/checkups",
            iconClass: "fa-calendar-minus",
            label: "Checkups",
        },
        {
            href: "/patient/sos",
            iconClass: "fa-clock",
            label: "SOS",
        }
    ]
    return (
        <aside className='sidebar show-aside' id='sidebar'>
            {
                links.map((link, index) => (
                    link.label.toLowerCase() !== active ?
                        <Link href={link.href} key={index}><i className={"fa-regular " + link.iconClass}></i>{link.label}</Link> : <Link href={link.href} key={index} className='active'><i className={"fa-regular " + link.iconClass}></i>{link.label}</Link>
                ))
            }
        </aside>
    )
}



export default PatientSideBar