"use client";
import { useState } from "react";
import { useParams } from "next/navigation";

const Temp = () => {
  const params = useParams();
  const [activeSection, setActiveSection] = useState('overview');
  const [isEditMode, setIsEditMode] = useState({
    personal: false,
    appointments: false,
    medicines: false,
  });

  return (
    <div className="patient-detail-page">
      {/* Header Section */}
      <div className="page-header">
        <div className="patient-header-info">
          <div className="avatar-section">
            <div className="patient-avatar">
              <img src="/default-avatar.png" alt="Patient" />
              <span className="status-indicator online"></span>
            </div>
            <div className="patient-basic-info">
              <h1>John Doe</h1>
              <div className="patient-meta">
                <span className="patient-id">ID: {params.id}</span>
                <span className="divider">•</span>
                <span className="patient-age">45 Years</span>
                <span className="divider">•</span>
                <span className="blood-group">O+</span>
              </div>
              <div className="contact-info">
                <span>📧 john.doe@email.com</span>
                <span>📱 +91 9876543210</span>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-secondary">
              📄 Download Records
            </button>
            <button className="btn-primary">
              📞 Contact Patient
            </button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon appointments">📅</div>
            <div className="stat-content">
              <span className="stat-value">12</span>
              <span className="stat-label">Total Visits</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon medicines">💊</div>
            <div className="stat-content">
              <span className="stat-value">5</span>
              <span className="stat-label">Active Meds</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon next-visit">⏰</div>
            <div className="stat-content">
              <span className="stat-value">Oct 28</span>
              <span className="stat-label">Next Visit</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon status">❤️</div>
            <div className="stat-content">
              <span className="stat-value">Stable</span>
              <span className="stat-label">Condition</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="section-tabs">
        <button 
          className={activeSection === 'overview' ? 'tab active' : 'tab'}
          onClick={() => setActiveSection('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={activeSection === 'personal' ? 'tab active' : 'tab'}
          onClick={() => setActiveSection('personal')}
        >
          👤 Personal Info
        </button>
        <button 
          className={activeSection === 'appointments' ? 'tab active' : 'tab'}
          onClick={() => setActiveSection('appointments')}
        >
          📅 Appointments
        </button>
        <button 
          className={activeSection === 'medicines' ? 'tab active' : 'tab'}
          onClick={() => setActiveSection('medicines')}
        >
          💊 Medicines
        </button>
        <button 
          className={activeSection === 'medical-history' ? 'tab active' : 'tab'}
          onClick={() => setActiveSection('medical-history')}
        >
          📋 Medical History
        </button>
        <button 
          className={activeSection === 'reports' ? 'tab active' : 'tab'}
          onClick={() => setActiveSection('reports')}
        >
          📁 Reports & Documents
        </button>
      </div>

      {/* Main Content Area */}
      <div className="content-area">
        
        {/* OVERVIEW SECTION */}
        {activeSection === 'overview' && (
          <div className="overview-section">
            <div className="two-column-layout">
              {/* Left Column */}
              <div className="left-column">
                {/* Recent Activity */}
                <div className="card">
                  <div className="card-header">
                    <h3>Recent Activity</h3>
                    <button className="view-all-btn">View All →</button>
                  </div>
                  <div className="timeline">
                    <div className="timeline-item">
                      <div className="timeline-dot consultation"></div>
                      <div className="timeline-content">
                        <h4>Follow-up Consultation</h4>
                        <p>Dr. Sarah Johnson - Cardiology</p>
                        <span className="time">2 days ago</span>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-dot lab"></div>
                      <div className="timeline-content">
                        <h4>Lab Test Completed</h4>
                        <p>Blood Sugar, Cholesterol Panel</p>
                        <span className="time">5 days ago</span>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-dot prescription"></div>
                      <div className="timeline-content">
                        <h4>New Prescription</h4>
                        <p>3 medications prescribed</p>
                        <span className="time">1 week ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vital Signs Chart */}
                <div className="card">
                  <div className="card-header">
                    <h3>Vital Signs Trend</h3>
                    <select className="time-filter">
                      <option>Last 7 Days</option>
                      <option>Last Month</option>
                      <option>Last 3 Months</option>
                    </select>
                  </div>
                  <div className="chart-placeholder">
                    <div className="chart-mock">
                      {/* Placeholder for chart */}
                      <div className="chart-line"></div>
                      <p>Blood Pressure & Heart Rate Chart</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="right-column">
                {/* Current Vitals */}
                <div className="card vitals-card">
                  <div className="card-header">
                    <h3>Current Vitals</h3>
                    <span className="last-updated">Updated 2 hours ago</span>
                  </div>
                  <div className="vitals-grid">
                    <div className="vital-item">
                      <div className="vital-icon bp">🩸</div>
                      <div className="vital-info">
                        <span className="vital-label">Blood Pressure</span>
                        <span className="vital-value normal">120/80</span>
                      </div>
                    </div>
                    <div className="vital-item">
                      <div className="vital-icon heart">❤️</div>
                      <div className="vital-info">
                        <span className="vital-label">Heart Rate</span>
                        <span className="vital-value normal">72 bpm</span>
                      </div>
                    </div>
                    <div className="vital-item">
                      <div className="vital-icon temp">🌡️</div>
                      <div className="vital-info">
                        <span className="vital-label">Temperature</span>
                        <span className="vital-value normal">98.6°F</span>
                      </div>
                    </div>
                    <div className="vital-item">
                      <div className="vital-icon oxygen">💨</div>
                      <div className="vital-info">
                        <span className="vital-label">Oxygen Saturation</span>
                        <span className="vital-value normal">98%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="card">
                  <div className="card-header">
                    <h3>Upcoming Appointments</h3>
                    <button className="add-btn">+ Add</button>
                  </div>
                  <div className="appointments-list">
                    <div className="appointment-item upcoming">
                      <div className="appointment-date">
                        <span className="day">28</span>
                        <span className="month">Oct</span>
                      </div>
                      <div className="appointment-details">
                        <h4>General Checkup</h4>
                        <p>Dr. Sarah Johnson - Cardiology</p>
                        <span className="time">10:00 AM - 10:30 AM</span>
                      </div>
                      <span className="appointment-status confirmed">Confirmed</span>
                    </div>
                    <div className="appointment-item">
                      <div className="appointment-date">
                        <span className="day">05</span>
                        <span className="month">Nov</span>
                      </div>
                      <div className="appointment-details">
                        <h4>Lab Test Follow-up</h4>
                        <p>Dr. Michael Chen - Internal Medicine</p>
                        <span className="time">2:00 PM - 2:30 PM</span>
                      </div>
                      <span className="appointment-status pending">Pending</span>
                    </div>
                  </div>
                </div>

                {/* Active Medications */}
                <div className="card">
                  <div className="card-header">
                    <h3>Active Medications</h3>
                    <button className="view-all-btn">View All →</button>
                  </div>
                  <div className="medications-list">
                    <div className="medication-item">
                      <div className="med-icon">💊</div>
                      <div className="med-details">
                        <h4>Lisinopril 10mg</h4>
                        <p>Once daily - Morning</p>
                      </div>
                      <span className="med-adherence high">95%</span>
                    </div>
                    <div className="medication-item">
                      <div className="med-icon">💊</div>
                      <div className="med-details">
                        <h4>Metformin 500mg</h4>
                        <p>Twice daily - With meals</p>
                      </div>
                      <span className="med-adherence high">92%</span>
                    </div>
                    <div className="medication-item">
                      <div className="med-icon">💊</div>
                      <div className="med-details">
                        <h4>Aspirin 81mg</h4>
                        <p>Once daily - Morning</p>
                      </div>
                      <span className="med-adherence medium">78%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PERSONAL INFO SECTION */}
        {activeSection === 'personal' && (
          <div className="personal-info-section">
            <div className="card">
              <div className="card-header">
                <h3>Personal Information</h3>
                <button 
                  className="edit-btn"
                  onClick={() => setIsEditMode({...isEditMode, personal: !isEditMode.personal})}
                >
                  {isEditMode.personal ? '💾 Save' : '✏️ Edit'}
                </button>
              </div>
              
              <div className="info-grid">
                <div className="info-section">
                  <h4>Basic Information</h4>
                  <div className="info-row">
                    <label>Full Name</label>
                    {isEditMode.personal ? (
                      <input type="text" defaultValue="John Doe" />
                    ) : (
                      <span>John Doe</span>
                    )}
                  </div>
                  <div className="info-row">
                    <label>Date of Birth</label>
                    {isEditMode.personal ? (
                      <input type="date" defaultValue="1978-05-15" />
                    ) : (
                      <span>May 15, 1978 (45 years)</span>
                    )}
                  </div>
                  <div className="info-row">
                    <label>Gender</label>
                    {isEditMode.personal ? (
                      <select defaultValue="male">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <span>Male</span>
                    )}
                  </div>
                  <div className="info-row">
                    <label>Blood Group</label>
                    {isEditMode.personal ? (
                      <select defaultValue="O+">
                        <option>A+</option>
                        <option>A-</option>
                        <option>B+</option>
                        <option>B-</option>
                        <option>O+</option>
                        <option>O-</option>
                        <option>AB+</option>
                        <option>AB-</option>
                      </select>
                    ) : (
                      <span>O+</span>
                    )}
                  </div>
                </div>

                <div className="info-section">
                  <h4>Contact Information</h4>
                  <div className="info-row">
                    <label>Email Address</label>
                    {isEditMode.personal ? (
                      <input type="email" defaultValue="john.doe@email.com" />
                    ) : (
                      <span>john.doe@email.com</span>
                    )}
                  </div>
                  <div className="info-row">
                    <label>Phone Number</label>
                    {isEditMode.personal ? (
                      <input type="tel" defaultValue="+91 9876543210" />
                    ) : (
                      <span>+91 9876543210</span>
                    )}
                  </div>
                  <div className="info-row">
                    <label>Emergency Contact</label>
                    {isEditMode.personal ? (
                      <input type="tel" defaultValue="+91 9876543211" />
                    ) : (
                      <span>+91 9876543211</span>
                    )}
                  </div>
                  <div className="info-row">
                    <label>Address</label>
                    {isEditMode.personal ? (
                      <textarea defaultValue="123 Main Street, Dehradun, Uttarakhand 248001"></textarea>
                    ) : (
                      <span>123 Main Street, Dehradun, Uttarakhand 248001</span>
                    )}
                  </div>
                </div>

                <div className="info-section">
                  <h4>Insurance Information</h4>
                  <div className="info-row">
                    <label>Insurance Provider</label>
                    {isEditMode.personal ? (
                      <input type="text" defaultValue="Star Health Insurance" />
                    ) : (
                      <span>Star Health Insurance</span>
                    )}
                  </div>
                  <div className="info-row">
                    <label>Policy Number</label>
                    {isEditMode.personal ? (
                      <input type="text" defaultValue="SH123456789" />
                    ) : (
                      <span>SH123456789</span>
                    )}
                  </div>
                  <div className="info-row">
                    <label>Coverage Type</label>
                    {isEditMode.personal ? (
                      <select defaultValue="family">
                        <option value="individual">Individual</option>
                        <option value="family">Family</option>
                      </select>
                    ) : (
                      <span>Family Floater</span>
                    )}
                  </div>
                </div>

                <div className="info-section">
                  <h4>Medical Information</h4>
                  <div className="info-row">
                    <label>Allergies</label>
                    {isEditMode.personal ? (
                      <textarea defaultValue="Penicillin, Peanuts"></textarea>
                    ) : (
                      <div className="allergies-tags">
                        <span className="tag allergy">Penicillin</span>
                        <span className="tag allergy">Peanuts</span>
                      </div>
                    )}
                  </div>
                  <div className="info-row">
                    <label>Chronic Conditions</label>
                    {isEditMode.personal ? (
                      <textarea defaultValue="Hypertension, Type 2 Diabetes"></textarea>
                    ) : (
                      <div className="conditions-tags">
                        <span className="tag condition">Hypertension</span>
                        <span className="tag condition">Type 2 Diabetes</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* APPOINTMENTS SECTION */}
        {activeSection === 'appointments' && (
          <div className="appointments-section">
            <div className="card">
              <div className="card-header">
                <h3>Appointments Management</h3>
                <button className="btn-primary">+ Schedule New Appointment</button>
              </div>

              {/* Filter Tabs */}
              <div className="appointment-filters">
                <button className="filter-tab active">All</button>
                <button className="filter-tab">Upcoming</button>
                <button className="filter-tab">Past</button>
                <button className="filter-tab">Cancelled</button>
              </div>

              {/* Appointments Table */}
              <div className="appointments-table">
                <table>
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>Department</th>
                      <th>Doctor</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="upcoming-row">
                      <td>
                        <div className="date-time">
                          <span className="date">Oct 28, 2025</span>
                          <span className="time">10:00 AM</span>
                        </div>
                      </td>
                      <td>Cardiology</td>
                      <td>
                        <div className="doctor-info">
                          <img src="/doctor-avatar.png" alt="Dr" />
                          <span>Dr. Sarah Johnson</span>
                        </div>
                      </td>
                      <td><span className="type-badge checkup">General Checkup</span></td>
                      <td><span className="status-badge confirmed">Confirmed</span></td>
                      <td>
                        <button className="action-btn">✏️</button>
                        <button className="action-btn">❌</button>
                        <button className="action-btn">👁️</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="date-time">
                          <span className="date">Nov 5, 2025</span>
                          <span className="time">2:00 PM</span>
                        </div>
                      </td>
                      <td>Internal Medicine</td>
                      <td>
                        <div className="doctor-info">
                          <img src="/doctor-avatar.png" alt="Dr" />
                          <span>Dr. Michael Chen</span>
                        </div>
                      </td>
                      <td><span className="type-badge followup">Follow-up</span></td>
                      <td><span className="status-badge pending">Pending</span></td>
                      <td>
                        <button className="action-btn">✏️</button>
                        <button className="action-btn">❌</button>
                        <button className="action-btn">👁️</button>
                      </td>
                    </tr>
                    <tr className="past-row">
                      <td>
                        <div className="date-time">
                          <span className="date">Oct 15, 2025</span>
                          <span className="time">11:00 AM</span>
                        </div>
                      </td>
                      <td>Cardiology</td>
                      <td>
                        <div className="doctor-info">
                          <img src="/doctor-avatar.png" alt="Dr" />
                          <span>Dr. Sarah Johnson</span>
                        </div>
                      </td>
                      <td><span className="type-badge consultation">Consultation</span></td>
                      <td><span className="status-badge completed">Completed</span></td>
                      <td>
                        <button className="action-btn">📄</button>
                        <button className="action-btn">👁️</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MEDICINES SECTION */}
        {activeSection === 'medicines' && (
          <div className="medicines-section">
            <div className="card">
              <div className="card-header">
                <h3>Medication Management</h3>
                <button className="btn-primary">+ Add New Medication</button>
              </div>

              {/* Medicine Filters */}
              <div className="medicine-filters">
                <button className="filter-tab active">Active</button>
                <button className="filter-tab">Completed</button>
                <button className="filter-tab">Discontinued</button>
              </div>

              {/* Medicines List */}
              <div className="medicines-grid">
                <div className="medicine-card active">
                  <div className="medicine-header">
                    <div className="med-name-section">
                      <h4>Lisinopril 10mg</h4>
                      <span className="med-category">Antihypertensive</span>
                    </div>
                    <div className="med-actions">
                      <button className="icon-btn">✏️</button>
                      <button className="icon-btn">🗑️</button>
                    </div>
                  </div>
                  <div className="medicine-details">
                    <div className="detail-row">
                      <span className="label">💊 Dosage:</span>
                      <span>1 tablet daily</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">⏰ Timing:</span>
                      <span>Morning, before breakfast</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">📅 Duration:</span>
                      <span>Oct 1, 2025 - Dec 31, 2025</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">👨‍⚕️ Prescribed by:</span>
                      <span>Dr. Sarah Johnson - Cardiology</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">📝 Instructions:</span>
                      <span>Take with water, avoid alcohol</span>
                    </div>
                  </div>
                  <div className="medicine-footer">
                    <div className="adherence-bar">
                      <span className="adherence-label">Adherence: 95%</span>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '95%'}}></div>
                      </div>
                    </div>
                    <span className="refill-info">Refills: 2 remaining</span>
                  </div>
                </div>

                <div className="medicine-card active">
                  <div className="medicine-header">
                    <div className="med-name-section">
                      <h4>Metformin 500mg</h4>
                      <span className="med-category">Antidiabetic</span>
                    </div>
                    <div className="med-actions">
                      <button className="icon-btn">✏️</button>
                      <button className="icon-btn">🗑️</button>
                    </div>
                  </div>
                  <div className="medicine-details">
                    <div className="detail-row">
                      <span className="label">💊 Dosage:</span>
                      <span>1 tablet twice daily</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">⏰ Timing:</span>
                      <span>Morning & Evening with meals</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">📅 Duration:</span>
                      <span>Sep 15, 2025 - Ongoing</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">👨‍⚕️ Prescribed by:</span>
                      <span>Dr. Michael Chen - Internal Medicine</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">📝 Instructions:</span>
                      <span>Take with food to reduce stomach upset</span>
                    </div>
                  </div>
                  <div className="medicine-footer">
                    <div className="adherence-bar">
                      <span className="adherence-label">Adherence: 92%</span>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: '92%'}}></div>
                      </div>
                    </div>
                    <span className="refill-info">Refills: 5 remaining</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MEDICAL HISTORY SECTION */}
        {activeSection === 'medical-history' && (
          <div className="medical-history-section">
            <div className="card">
              <div className="card-header">
                <h3>Medical History</h3>
                <button className="btn-secondary">📥 Export History</button>
              </div>

              <div className="history-timeline">
                <div className="history-item">
                  <div className="history-date">
                    <span className="month">Oct</span>
                    <span className="year">2025</span>
                  </div>
                  <div className="history-content">
                    <div className="history-card">
                      <div className="history-header">
                        <h4>Cardiology Consultation</h4>
                        <span className="date">Oct 15, 2025</span>
                      </div>
                      <p className="doctor">Dr. Sarah Johnson - Cardiology Department</p>
                      <div className="diagnosis">
                        <strong>Diagnosis:</strong> Hypertension Stage 1
                      </div>
                      <div className="treatment">
                        <strong>Treatment:</strong> Prescribed Lisinopril 10mg, lifestyle modifications recommended
                      </div>
                      <div className="notes">
                        <strong>Notes:</strong> Patient responding well to treatment. Blood pressure readings improving. Follow-up in 2 weeks.
                      </div>
                      <button className="view-details-btn">View Full Details →</button>
                    </div>
                  </div>
                </div>

                <div className="history-item">
                  <div className="history-date">
                    <span className="month">Sep</span>
                    <span className="year">2025</span>
                  </div>
                  <div className="history-content">
                    <div className="history-card">
                      <div className="history-header">
                        <h4>Diabetes Management</h4>
                        <span className="date">Sep 15, 2025</span>
                      </div>
                      <p className="doctor">Dr. Michael Chen - Internal Medicine</p>
                      <div className="diagnosis">
                        <strong>Diagnosis:</strong> Type 2 Diabetes Mellitus
                      </div>
                      <div className="treatment">
                        <strong>Treatment:</strong> Started on Metformin 500mg, dietary counseling provided
                      </div>
                      <div className="lab-results">
                        <strong>Lab Results:</strong>
                        <span className="result">HbA1c: 7.2%</span>
                        <span className="result">Fasting Glucose: 145 mg/dL</span>
                      </div>
                      <button className="view-details-btn">View Full Details →</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REPORTS SECTION */}
        {activeSection === 'reports' && (
          <div className="reports-section">
            <div className="card">
              <div className="card-header">
                <h3>Reports & Documents</h3>
                <button className="btn-primary">📤 Upload Document</button>
              </div>

              {/* Document Categories */}
              <div className="document-categories">
                <button className="category-tab active">All Documents</button>
                <button className="category-tab">Lab Reports</button>
                <button className="category-tab">Prescriptions</button>
                <button className="category-tab">Imaging</button>
                <button className="category-tab">Other</button>
              </div>

              {/* Documents Grid */}
              <div className="documents-grid">
                <div className="document-card">
                  <div className="doc-icon lab-report">📊</div>
                  <div className="doc-info">
                    <h4>Blood Test - Complete Panel</h4>
                    <p>Uploaded on Oct 16, 2025</p>
                    <span className="doc-size">2.4 MB</span>
                  </div>
                  <div className="doc-actions">
                    <button className="action-btn">👁️ View</button>
                    <button className="action-btn">⬇️ Download</button>
                    <button className="action-btn">🗑️ Delete</button>
                  </div>
                </div>

                <div className="document-card">
                  <div className="doc-icon prescription">💊</div>
                  <div className="doc-info">
                    <h4>Prescription - Cardiology</h4>
                    <p>Uploaded on Oct 15, 2025</p>
                    <span className="doc-size">1.2 MB</span>
                  </div>
                  <div className="doc-actions">
                    <button className="action-btn">👁️ View</button>
                    <button className="action-btn">⬇️ Download</button>
                    <button className="action-btn">🗑️ Delete</button>
                  </div>
                </div>

                <div className="document-card">
                  <div className="doc-icon imaging">🔬</div>
                  <div className="doc-info">
                    <h4>ECG Report</h4>
                    <p>Uploaded on Oct 10, 2025</p>
                    <span className="doc-size">3.1 MB</span>
                  </div>
                  <div className="doc-actions">
                    <button className="action-btn">👁️ View</button>
                    <button className="action-btn">⬇️ Download</button>
                    <button className="action-btn">🗑️ Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      <style jsx>{`
        .patient-detail-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          background: #f5f7fa;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }

        /* Header Section */
        .page-header {
          background: white;
          border-radius: 16px;
          padding: 30px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .patient-header-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .avatar-section {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .patient-avatar {
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid #e3f2fd;
        }

        .patient-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .status-indicator {
          position: absolute;
          bottom: 5px;
          right: 5px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
        }

        .status-indicator.online {
          background: #4caf50;
        }

        .patient-basic-info h1 {
          margin: 0 0 8px 0;
          font-size: 28px;
          color: #1a1a1a;
        }

        .patient-meta {
          display: flex;
          gap: 8px;
          align-items: center;
          color: #666;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .divider {
          color: #ddd;
        }

        .contact-info {
          display: flex;
          gap: 20px;
          font-size: 14px;
          color: #666;
          flex-wrap: wrap;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .btn-primary, .btn-secondary {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-primary {
          background: #2196f3;
          color: white;
        }

        .btn-primary:hover {
          background: #1976d2;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: #f5f5f5;
          color: #333;
        }

        .btn-secondary:hover {
          background: #e0e0e0;
        }

        /* Quick Stats */
        .quick-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          color: white;
        }

        .stat-card:nth-child(2) {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .stat-card:nth-child(3) {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .stat-card:nth-child(4) {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }

        .stat-icon {
          font-size: 36px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 24px;
          font-weight: bold;
        }

        .stat-label {
          font-size: 12px;
          opacity: 0.9;
        }

        /* Section Tabs */
        .section-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          overflow-x: auto;
          padding: 4px;
        }

        .tab {
          padding: 12px 24px;
          background: white;
          border: 2px solid transparent;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
          color: #666;
        }

        .tab:hover {
          background: #f5f5f5;
        }

        .tab.active {
          background: #2196f3;
          color: white;
          border-color: #2196f3;
        }

        /* Card Styles */
        .card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          margin-bottom: 24px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f0f0f0;
        }

        .card-header h3 {
          margin: 0;
          font-size: 20px;
          color: #1a1a1a;
        }

        /* Two Column Layout */
        .two-column-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        /* Timeline */
        .timeline {
          position: relative;
          padding-left: 40px;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 15px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #e0e0e0;
        }

        .timeline-item {
          position: relative;
          margin-bottom: 24px;
        }

        .timeline-dot {
          position: absolute;
          left: -32px;
          top: 4px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 0 0 2px #2196f3;
        }

        .timeline-dot.consultation {
          background: #2196f3;
        }

        .timeline-dot.lab {
          background: #ff9800;
        }

        .timeline-dot.prescription {
          background: #4caf50;
        }

        .timeline-content h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
          color: #1a1a1a;
        }

        .timeline-content p {
          margin: 0 0 4px 0;
          color: #666;
          font-size: 14px;
        }

        .timeline-content .time {
          font-size: 12px;
          color: #999;
        }

        /* Vitals */
        .vitals-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .vital-item {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .vital-icon {
          font-size: 28px;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 8px;
        }

        .vital-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .vital-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
        }

        .vital-value {
          font-size: 18px;
          font-weight: bold;
          color: #1a1a1a;
        }

        .vital-value.normal {
          color: #4caf50;
        }

        /* Appointments */
        .appointment-item {
          display: flex;
          gap: 16px;
          padding: 16px;
          border-radius: 8px;
          background: #f9f9f9;
          margin-bottom: 12px;
          align-items: center;
        }

        .appointment-item.upcoming {
          background: #e3f2fd;
          border-left: 4px solid #2196f3;
        }

        .appointment-date {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px;
          background: white;
          border-radius: 8px;
          min-width: 60px;
        }

        .appointment-date .day {
          font-size: 24px;
          font-weight: bold;
          color: #2196f3;
        }

        .appointment-date .month {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
        }

        .appointment-details {
          flex: 1;
        }

        .appointment-details h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
        }

        .appointment-details p {
          margin: 0 0 4px 0;
          color: #666;
          font-size: 14px;
        }

        .appointment-details .time {
          font-size: 12px;
          color: #999;
        }

        .appointment-status {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .appointment-status.confirmed {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .appointment-status.pending {
          background: #fff3e0;
          color: #ef6c00;
        }

        /* Medications */
        .medication-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: #f9f9f9;
          border-radius: 8px;
          margin-bottom: 10px;
          align-items: center;
        }

        .med-icon {
          font-size: 24px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 8px;
        }

        .med-details {
          flex: 1;
        }

        .med-details h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .med-details p {
          margin: 0;
          font-size: 12px;
          color: #666;
        }

        .med-adherence {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .med-adherence.high {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .med-adherence.medium {
          background: #fff3e0;
          color: #ef6c00;
        }

        /* Personal Info */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
        }

        .info-section h4 {
          margin: 0 0 20px 0;
          color: #2196f3;
          font-size: 16px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e3f2fd;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .info-row label {
          font-weight: 600;
          color: #666;
          font-size: 14px;
        }

        .info-row span {
          color: #1a1a1a;
          font-size: 14px;
        }

        .info-row input,
        .info-row select,
        .info-row textarea {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          flex: 1;
          margin-left: 20px;
        }

        .allergies-tags,
        .conditions-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .tag {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .tag.allergy {
          background: #ffebee;
          color: #c62828;
        }

        .tag.condition {
          background: #e8f5e9;
          color: #2e7d32;
        }

        /* Appointments Table */
        .appointment-filters {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }

        .filter-tab {
          padding: 8px 16px;
          background: #f5f5f5;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .filter-tab:hover {
          background: #e0e0e0;
        }

        .filter-tab.active {
          background: #2196f3;
          color: white;
        }

        .appointments-table {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead tr {
          background: #f9f9f9;
        }

        th {
          padding: 12px;
          text-align: left;
          font-size: 14px;
          font-weight: 600;
          color: #666;
        }

        td {
          padding: 16px 12px;
          border-bottom: 1px solid #f0f0f0;
        }

        tr.upcoming-row {
          background: #e3f2fd;
        }

        tr.past-row {
          opacity: 0.7;
        }

        .date-time {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .date-time .date {
          font-weight: 600;
          font-size: 14px;
        }

        .date-time .time {
          font-size: 12px;
          color: #666;
        }

        .doctor-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .doctor-info img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }

        .type-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
        }

        .type-badge.checkup {
          background: #e3f2fd;
          color: #1976d2;
        }

        .type-badge.followup {
          background: #fff3e0;
          color: #ef6c00;
        }

        .type-badge.consultation {
          background: #f3e5f5;
          color: #7b1fa2;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
        }

        .status-badge.confirmed {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .status-badge.pending {
          background: #fff3e0;
          color: #ef6c00;
        }

        .status-badge.completed {
          background: #e0e0e0;
          color: #616161;
        }

        .action-btn {
          padding: 6px 10px;
          background: #f5f5f5;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          margin-right: 4px;
          transition: all 0.3s;
        }

        .action-btn:hover {
          background: #e0e0e0;
        }

        /* Medicines Grid */
        .medicine-filters {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }

        .medicines-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 20px;
        }

        .medicine-card {
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s;
        }

        .medicine-card.active {
          border-color: #4caf50;
        }

        .medicine-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .medicine-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .med-name-section h4 {
          margin: 0 0 4px 0;
          font-size: 18px;
          color: #1a1a1a;
        }

        .med-category {
          font-size: 12px;
          color: #666;
          background: #f5f5f5;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .med-actions {
          display: flex;
          gap: 8px;
        }

        .icon-btn {
          padding: 6px 10px;
          background: #f5f5f5;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
        }

        .icon-btn:hover {
          background: #e0e0e0;
        }

        .medicine-details {
          margin-bottom: 16px;
        }

        .detail-row {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .detail-row .label {
          font-weight: 600;
          color: #666;
          min-width: 120px;
        }

        .medicine-footer {
          border-top: 1px solid #f0f0f0;
          padding-top: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .adherence-bar {
          flex: 1;
          margin-right: 20px;
        }

        .adherence-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
          display: block;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4caf50, #8bc34a);
          transition: width 0.3s;
        }

        .refill-info {
          font-size: 12px;
          color: #666;
        }

        /* Medical History */
        .history-timeline {
          position: relative;
        }

        .history-item {
          display: flex;
          gap: 24px;
          margin-bottom: 32px;
        }

        .history-date {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 60px;
        }

        .history-date .month {
          font-size: 16px;
          font-weight: 600;
          color: #2196f3;
        }

        .history-date .year {
          font-size: 12px;
          color: #666;
        }

        .history-content {
          flex: 1;
        }

        .history-card {
          background: #f9f9f9;
          border-radius: 12px;
          padding: 20px;
          border-left: 4px solid #2196f3;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .history-header h4 {
          margin: 0;
          font-size: 18px;
          color: #1a1a1a;
        }

        .history-header .date {
          font-size: 14px;
          color: #666;
        }

        .history-card .doctor {
          color: #666;
          font-size: 14px;
          margin-bottom: 12px;
        }

        .history-card .diagnosis,
        .history-card .treatment,
        .history-card .notes,
        .history-card .lab-results {
          margin-bottom: 12px;
          font-size: 14px;
          line-height: 1.6;
        }

        .history-card strong {
          color: #1a1a1a;
        }

        .lab-results .result {
          display: inline-block;
          background: white;
          padding: 4px 12px;
          border-radius: 6px;
          margin-right: 8px;
          margin-top: 4px;
          font-size: 13px;
        }

        .view-details-btn {
          background: #2196f3;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          margin-top: 12px;
        }

        .view-details-btn:hover {
          background: #1976d2;
        }

        /* Documents */
        .document-categories {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .category-tab {
          padding: 8px 16px;
          background: #f5f5f5;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .category-tab:hover {
          background: #e0e0e0;
        }

        .category-tab.active {
          background: #2196f3;
          color: white;
        }

        .documents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 16px;
        }

        .document-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #f9f9f9;
          border-radius: 12px;
          border: 2px solid #e0e0e0;
          transition: all 0.3s;
        }

        .document-card:hover {
          border-color: #2196f3;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .doc-icon {
          font-size: 32px;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 12px;
        }

        .doc-info {
          flex: 1;
        }

        .doc-info h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
          color: #1a1a1a;
        }

        .doc-info p {
          margin: 0 0 4px 0;
          font-size: 12px;
          color: #666;
        }

        .doc-size {
          font-size: 12px;
          color: #999;
        }

        .doc-actions {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .doc-actions .action-btn {
          padding: 6px 12px;
          font-size: 12px;
          width: 100%;
          text-align: left;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .two-column-layout {
            grid-template-columns: 1fr;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .medicines-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .patient-header-info {
            flex-direction: column;
          }

          .quick-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .section-tabs {
            overflow-x: auto;
          }

          .documents-grid {
            grid-template-columns: 1fr;
          }

          .vitals-grid {
            grid-template-columns: 1fr;
          }
        }

        .view-all-btn,
        .add-btn,
        .edit-btn {
          padding: 6px 12px;
          background: #f5f5f5;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .view-all-btn:hover,
        .add-btn:hover,
        .edit-btn:hover {
          background: #e0e0e0;
        }

        .chart-placeholder {
          height: 300px;
          background: #f9f9f9;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chart-mock {
          text-align: center;
          color: #999;
        }

        .chart-line {
          width: 200px;
          height: 100px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin: 0 auto 16px;
          border-radius: 8px;
          opacity: 0.3;
        }

        .last-updated {
          font-size: 12px;
          color: #999;
        }

        .time-filter {
          padding: 6px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 13px;
          background: white;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Temp;
