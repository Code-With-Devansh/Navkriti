"use client";
import { useEffect, useState } from "react";
import { fetchWithPatientAuth } from "@/utils/patientAuth";

const MedicineReminder = () => {
  const [schedule, setSchedule] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today'); // 'today', 'history'

  useEffect(() => {
    loadData();
    // Set up interval to check for reminders every minute
    const interval = setInterval(() => {
      checkReminders();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load today's schedule
      const scheduleRes = await fetchWithPatientAuth('/api/patient/medicines/schedule');
      const scheduleData = await scheduleRes.json();
      
      if (scheduleData.success) {
        setSchedule(scheduleData.data);
      }

      // Load history and stats
      const historyRes = await fetchWithPatientAuth('/api/patient/medicines/history?days=7');
      const historyData = await historyRes.json();
      
      if (historyData.success) {
        setHistory(historyData.data.history);
        setStats(historyData.data.stats);
      }
    } catch (error) {
      console.error('Error loading medicine data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkReminders = () => {
    const now = new Date();
    const currentHour = now.getHours();

    schedule.forEach(med => {
      const medTime = new Date(med.scheduled_time);
      const medHour = medTime.getHours();
      
      // Show notification if within 15 minutes
      if (Math.abs(currentHour - medHour) === 0) {
        showNotification(med);
      }
    });
  };

  const showNotification = (med) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Medicine Reminder', {
        body: `Time to take ${med.medicine_name}`,
        icon: '/medicine-icon.png',
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        alert('Notifications enabled!');
      }
    }
  };

  const recordIntake = async (med, status) => {
    try {
      const response = await fetchWithPatientAuth('/api/patient/medicines/intake', {
        method: 'POST',
        body: JSON.stringify({
          prescription_id: med.prescription_id,
          medicine_name: med.medicine_name,
          status,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Medicine marked as ${status}`);
        loadData(); // Reload data
      }
    } catch (error) {
      console.error('Error recording intake:', error);
      alert('Failed to record intake');
    }
  };

  if (loading) {
    return <div className="loading">Loading medicine schedule...</div>;
  }

  return (
    <div className="medicine-reminder-container">
      <div className="header">
        <h2>💊 Medicine Reminder</h2>
        <button onClick={requestNotificationPermission} className="notify-btn">
          🔔 Enable Notifications
        </button>
      </div>

      {/* Statistics Card */}
      {stats && (
        <div className="stats-card">
          <div className="stat-item">
            <span className="stat-value">{stats.adherence_rate}%</span>
            <span className="stat-label">Adherence Rate</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.taken}</span>
            <span className="stat-label">Taken</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.missed}</span>
            <span className="stat-label">Missed</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={activeTab === 'today' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('today')}
        >
          Today's Schedule
        </button>
        <button 
          className={activeTab === 'history' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('history')}
        >
          History (7 Days)
        </button>
      </div>

      {/* Today's Schedule */}
      {activeTab === 'today' && (
        <div className="schedule-list">
          {schedule.length === 0 ? (
            <p className="no-data">No medicines scheduled for today</p>
          ) : (
            schedule.map((med, index) => (
              <div key={index} className="medicine-card">
                <div className="medicine-info">
                  <div className="medicine-header">
                    <span className="medicine-name">{med.medicine_name}</span>
                    {med.color && (
                      <span 
                        className="medicine-color"
                        style={{ backgroundColor: med.color }}
                      ></span>
                    )}
                  </div>
                  <p className="medicine-time">
                    ⏰ {med.time_range.start}:00 - {med.time_range.end}:00
                  </p>
                  {med.dosage && (
                    <p className="medicine-dosage">💊 {med.dosage}</p>
                  )}
                  {med.instructions && (
                    <p className="medicine-instructions">📝 {med.instructions}</p>
                  )}
                  <p className="medicine-doctor">
                    👨‍⚕️ {med.doctor_name || 'N/A'} - {med.dept}
                  </p>
                </div>
                <div className="action-buttons">
                  <button 
                    onClick={() => recordIntake(med, 'taken')}
                    className="btn-taken"
                  >
                    ✓ Taken
                  </button>
                  <button 
                    onClick={() => recordIntake(med, 'skipped')}
                    className="btn-skipped"
                  >
                    ⊗ Skip
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* History */}
      {activeTab === 'history' && (
        <div className="history-list">
          {history.length === 0 ? (
            <p className="no-data">No history available</p>
          ) : (
            history.map((intake, index) => (
              <div key={index} className={`history-card ${intake.status}`}>
                <div className="history-info">
                  <span className="history-medicine">{intake.medicine_name}</span>
                  <span className="history-date">
                    {new Date(intake.scheduled_time).toLocaleDateString()} {' '}
                    {new Date(intake.scheduled_time).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <span className={`status-badge ${intake.status}`}>
                  {intake.status.toUpperCase()}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      <style jsx>{`
        .medicine-reminder-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .notify-btn {
          padding: 10px 15px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }

        .notify-btn:hover {
          background: #0056b3;
        }

        .stats-card {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 15px;
          margin-bottom: 25px;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          color: white;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: bold;
        }

        .stat-label {
          font-size: 12px;
          opacity: 0.9;
        }

        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 2px solid #e0e0e0;
        }

        .tab {
          padding: 10px 20px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-size: 16px;
          color: #666;
          transition: all 0.3s;
        }

        .tab.active {
          color: #007bff;
          border-bottom-color: #007bff;
          font-weight: 600;
        }

        .schedule-list,
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .medicine-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .medicine-info {
          flex: 1;
        }

        .medicine-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .medicine-name {
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        .medicine-color {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #ddd;
        }

        .medicine-time,
        .medicine-dosage,
        .medicine-instructions,
        .medicine-doctor {
          margin: 5px 0;
          font-size: 14px;
          color: #666;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
        }

        .btn-taken,
        .btn-skipped {
          padding: 8px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s;
        }

        .btn-taken {
          background: #28a745;
          color: white;
        }

        .btn-taken:hover {
          background: #218838;
        }

        .btn-skipped {
          background: #ffc107;
          color: #333;
        }

        .btn-skipped:hover {
          background: #e0a800;
        }

        .history-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .history-card.missed {
          border-left: 4px solid #dc3545;
        }

        .history-card.taken {
          border-left: 4px solid #28a745;
        }

        .history-card.skipped {
          border-left: 4px solid #ffc107;
        }

        .history-info {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .history-medicine {
          font-weight: 600;
          color: #333;
        }

        .history-date {
          font-size: 12px;
          color: #666;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .status-badge.taken {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.missed {
          background: #f8d7da;
          color: #721c24;
        }

        .status-badge.skipped {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge.pending {
          background: #d1ecf1;
          color: #0c5460;
        }

        .no-data {
          text-align: center;
          padding: 40px;
          color: #999;
          font-size: 16px;
        }

        .loading {
          text-align: center;
          padding: 40px;
          font-size: 16px;
        }

        @media (max-width: 600px) {
          .medicine-card {
            flex-direction: column;
            align-items: flex-start;
          }

          .action-buttons {
            width: 100%;
            margin-top: 15px;
          }

          .btn-taken,
          .btn-skipped {
            flex: 1;
          }

          .stats-card {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default MedicineReminder;