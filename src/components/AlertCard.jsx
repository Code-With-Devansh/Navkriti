import React from 'react'

const AlertCard = ({className,iconClassName, patient_name, message, time}) => {
    return (
        <div className={'alert-card ' + className}>
            <div>
                <div>
                    <i class={"fa-solid " + iconClassName}></i>
                </div>
                <div>
                    <h3>{patient_name}</h3>
                    <p className='txt-light'>{message}</p>
                    <p className='txt-light'>{time} ago</p>
                </div>
            </div>
            <div>
                <button className='btn btn-primary'>Mark as Resolved</button>
            </div>
        </div>
    )
}

export default AlertCard