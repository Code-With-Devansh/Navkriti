"use client";
import { useEffect, useState } from 'react';
import { Bell, X, AlertTriangle } from 'lucide-react';

export default function AdminAlertListener() {
  const [alerts, setAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [latestAlert, setLatestAlert] = useState(null);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    
    if (!adminToken) {
      console.error('No admin token found');
      return;
    }

    // Connect to SSE stream
    const eventSource = new EventSource(
      `/api/admin/alerts/stream?token=${adminToken}`
    );

    eventSource.onopen = () => {
      console.log('✅ Connected to alert stream');
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'connected') {
          console.log('SSE connection established');
        } else if (data.type === 'ping') {
          // Keep-alive ping, ignore
        } else if (data.type === 'new-alert') {
          handleNewAlert(data.alert);
        } else if (data.type === 'alert-updated') {
          handleAlertUpdate(data.alert);
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      setIsConnected(false);
      eventSource.close();
      
      // Attempt reconnect after 5 seconds
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    };

    // Cleanup on unmount
    return () => {
      eventSource.close();
    };
  }, []);

  const handleNewAlert = (alert) => {
    console.log('🚨 New alert received:', alert);
    
    // Add to alerts list
    setAlerts(prev => [alert, ...prev]);
    setLatestAlert(alert);
    setShowNotification(true);
    
    // Play sound
    playAlertSound(alert.alert_type);
    
    // Show browser notification
    showBrowserNotification(alert);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 10000);
  };

  const handleAlertUpdate = (alertUpdate) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertUpdate.id 
          ? { ...alert, ...alertUpdate }
          : alert
      )
    );
  };

  const playAlertSound = (alertType) => {
    // Create audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // High priority = urgent sound
    if (alertType === 'high') {
      oscillator.frequency.value = 880; // A5 note
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
      
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.value = 880;
        gain2.gain.value = 0.3;
        osc2.start();
        osc2.stop(audioContext.currentTime + 0.2);
      }, 300);
    } else {
      oscillator.frequency.value = 440; // A4 note
      gainNode.gain.value = 0.2;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.15);
    }
  };

  const showBrowserNotification = (alert) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 New SOS Alert', {
        body: `${alert.patient_name} (${alert.patient_age}y) needs help!`,
        icon: '/alert-icon.png',
        badge: '/alert-badge.png',
        tag: alert.id,
        requireInteraction: true,
      });
    }
  };

  const dismissNotification = () => {
    setShowNotification(false);
  };

  const viewAlert = (alertId) => {
    window.location.href = `/admin/alerts/${alertId}`;
  };

  return (
    <>
      {/* Connection Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${
          isConnected 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`}></div>
          {isConnected ? 'Live' : 'Disconnected'}
        </div>
      </div>

      {/* Popup Notification */}
      {showNotification && latestAlert && (
        <div className="fixed top-20 right-4 z-50 w-96 bg-white rounded-lg shadow-2xl border-l-4 border-red-600 animate-slide-in">
          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="font-bold text-lg text-red-600">
                  🚨 NEW SOS ALERT
                </h3>
              </div>
              <button 
                onClick={dismissNotification}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2">
              <p className="font-semibold text-gray-900">
                {latestAlert.patient_name}
              </p>
              <p className="text-sm text-gray-600">
                Age: {latestAlert.patient_age} • Phone: {latestAlert.patient_phone}
              </p>
              {latestAlert.sos_transcription && (
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded italic">
                  "{latestAlert.sos_transcription}"
                </p>
              )}
              <p className="text-xs text-gray-500">
                Duration: {latestAlert.sos_duration}s • Priority: {latestAlert.priority}/5
              </p>
            </div>
            
            <button
              onClick={() => viewAlert(latestAlert.id)}
              className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-semibold"
            >
              View Full Alert →
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}