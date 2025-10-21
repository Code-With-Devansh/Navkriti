import Link from "next/link";
import React from "react";

const PatientCard = (props) => {
  const { name, age, follow_up, condition, missed_doses } = props;
  return (
    <div className="patient-card">
      <div className="profile-content">
        <div>
          <i className={"fa-regular fa-user userIcon"}></i>
        </div>
        <div>
          <h2>{name}</h2>
          <p className="txt-light"> Age : {age}</p>
        </div>
      </div>
      <div className="details-content">
        <div>
          <p className="txt-light">Next Checkup :</p>
          <p>
            {new Date(follow_up).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <div>
          <p className="txt-light">Missed Doses :</p>
          <p className="missed-doses-text">{missed_doses}</p>
        </div>
        <div>
          <p className="txt-light">Condition :</p>
          <p>{condition}</p>
        </div>

        <Link
          href={`/hospital/patients/${props.id}`}
          className="view-profile-btn"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default PatientCard;
