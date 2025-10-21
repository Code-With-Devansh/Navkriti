import React from 'react'

const AppointmentCard = () => {
  return (
    <div className='appointment-card'>
      <div className='introPara'>
        <i className='fa-regular fa-user'></i>
        <div>
          <h3>Devesh Sharma</h3>
          <p className='text-light'>Follow-up</p>
        </div>
      </div>
      <div className='detailsPara'>
        <div>
          <i className="fa-solid fa-clock"></i>
          10:00 AM
        </div>
        <div>
          <i className="fa-solid fa-user"></i>
          Dr. Devesh
        </div>
        <div>
          <i className="fa-solid fa-location-dot"></i>
          Room 203
        </div>
      </div>
    </div>
  )
}

export default AppointmentCard