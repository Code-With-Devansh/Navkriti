import Link from 'next/link'
import React from 'react'

const PatientCard = () => {
    return (
        <div className='patient-card'>
            <div className='profile-content'>
                <div>
                    <i className={'fa-regular fa-user userIcon'}></i>
                </div>
                <div>
                    <h2>Devesh Sharma</h2>
                    <p className='txt-light'> Age : 17</p>
                </div>
            </div>
            <div className='details-content'>
                <div>
                    <p className="txt-light">Next Checkup :</p>
                    <p>Jan, 20, 2025</p>
                </div>
                <div>
                    <p className="txt-light">Missed Doses :</p>
                    <p className='missed-doses-text'>1</p>
                </div>
                <div>
                    <p className="txt-light">Condition :</p>
                    <p>Hypertension</p>
                </div>

                <Link href="/hospital/patient/devesh-sharma" className='view-profile-btn'>View Profile</Link>
            </div>
        </div>
    )
}

export default PatientCard