import React from 'react'

const AlertCard = ({className,iconClassName, patient_name, message, time, alert_type,  alert_id, setRefresh}) => {
    const markAsResolved = () => {
        // API call to mark alert as resolved
        fetch(`/api/alerts/${alert_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "authorization": `Bearer ${localStorage.getItem("adminToken")}`
            },
            body: JSON.stringify({ status: 'resolved' })
        }).then(response => response.json())
        .then(data => {
            console.log("Alert marked as resolved:", data);
            setRefresh(prev => !prev); // Trigger refresh in parent component
        })
        .catch(error => {
            console.error("Error marking alert as resolved:", error);
        });
    }
    return (
        <div className={'alert-card ' + className}>
            <div>
                <div>
                    <i className={"fa-solid " + iconClassName}></i>
                </div>
                <div>
                    <h3>{patient_name}</h3>
                    <p className='txt-light'>{message}</p>
                    <p className='txt-light'>{time} ago</p>
                </div>
            </div>
            <div>
                <button className='btn btn-primary' onClick={markAsResolved}>Mark as Resolved</button>
            </div>
        </div>
    )
}

export default AlertCard