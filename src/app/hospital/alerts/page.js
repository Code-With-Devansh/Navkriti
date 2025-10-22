import AlertCard from '@/components/AlertCard'
import ResolvedAlertCard from '@/components/ResolvedAlertCard';
import SideBar from '@/components/SideBar'
import React, { useEffect } from 'react'

const Alerts = () => {
  const [alerts, setAlerts] = React.useState([]);
  useEffect(() => {
    // Fetch alerts from the API
    const fetchAlerts = async () => { 
      try {
        const response = await fetch('/api/alerts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setAlerts(data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } 
    };
    fetchAlerts();
  }, []);
  return (
    <div>
      <SideBar active={"alerts"} />
      <div className="container">
        <div className="introPara">
          <h2>Alerts Page</h2>
          <p className="txt-light">Monitor and manage patient alerts</p>
        </div>
        <div>
          <h2>
            Active alerts <span className="missed-doses-text">3</span>
          </h2>
          {alerts.length === 0 && <p>No alerts found.</p>}
          {alerts.map((alert) => {  // divide on based of status
          if(alert.status !== 'pending') return null;
            return <AlertCard
            iconClassName="fa-circle-info"
            className={"emergency-card"}
            patient_name={alert.patient_name}
            message={alert.category}
            time={(new Date() - Date(alert.createdAt))}
              key={alert._id}/>
          })}
          
        </div>

        <div>
          <h2>
            Resolved alerts <span className="resolved-alert-text">3</span>
          </h2>
          {alerts.map((alert) => {  // divide on based of status
          if(alert.status !== 'resolved') return null;
          <ResolvedAlertCard
          iconClassName="fa-thumbs-up"
          className={"doses-missed-card"}
          patient_name={alert.patient_name}
          message={alert.category}
          time={(new Date() - Date(alert.createdAt))}
            key={alert._id}
          />
          })}
          <ResolvedAlertCard
            iconClassName="fa-thumbs-up"
            className={"doses-missed-card"}
            patient_name="Devesh Sharma"
            message="SOS triggered "
            time="2 min"
          />
          <ResolvedAlertCard
            iconClassName="fa-thumbs-up"
            className={"doses-missed-card"}
            patient_name="Devesh Sharma"
            message="SOS triggered "
            time="2 min"
          />
        </div>
      </div>
    </div>
  );
}

export default Alerts