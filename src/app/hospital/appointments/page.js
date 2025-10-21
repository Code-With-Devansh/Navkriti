import SideBar from '@/components/SideBar'
import React from 'react'

const Appointments = () => {
  return (
    <div>
        <SideBar active={"appointments"} />
        <div className="container">
          <div className="introPara">
            <h2>Appointments</h2>
            <p className='txt-light'>Manage patient appointments and appointments schedule</p>
          </div>
        </div>
    </div>
  )
}

export default Appointments