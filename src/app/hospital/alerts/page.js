import AlertCard from '@/components/AlertCard'
import ResolvedAlertCard from '@/components/ResolvedAlertCard';
import SideBar from '@/components/SideBar'
import React from 'react'

const Alerts = () => {
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
          <AlertCard
            iconClassName="fa-circle-info"
            className={"emergency-card"}
            patient_name="Devesh Sharma"
            message="SOS triggered "
            time="2 min"
          />
          <AlertCard
            iconClassName="fa-signal"
            className={"doses-missed-card"}
            patient_name="Devesh Sharma"
            message="SOS triggered "
            time="2 min"
          />
          <AlertCard
            iconClassName="fa-circle-info"
            className={"emergency-card"}
            patient_name="Devesh Sharma"
            message="SOS triggered "
            time="2 min"
          />
          <AlertCard
            iconClassName="fa-signal"
            className={"doses-missed-card"}
            patient_name="Devesh Sharma"
            message="SOS triggered "
            time="2 min"
          />
        </div>

        <div>
          <h2>
            Resolved alerts <span className="resolved-alert-text">3</span>
          </h2>
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