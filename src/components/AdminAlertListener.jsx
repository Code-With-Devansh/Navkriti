// components/AdminAlertListener.jsx
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Wifi, WifiOff, BellOff } from 'lucide-react';
import CustomNotification from './CustomNotification';

export default function AdminAlertListener() {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [latestAlert, setLatestAlert] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const eventSourceRef = useRef(null);

  // Check notification permission
  useEffect(() => {
    if ('Notification' in window) {
      console.log('Current notification permission:', Notification.permission);
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Handle incoming SSE messages
  const handleMessage = useCallback((event) => {
    console.log('SSE message received:', event.data);
    
    try {
      const data = JSON.parse(event.data);
      console.log('Parsed SSE data:', data);
      
      if (data.type === 'connected') {
        console.log('SSE connection established');
        setConnectionStatus('connected');
        return;
      }

      if (data.type === 'new-alert') {
        console.log('New alert received:', data.alert);
        setLatestAlert(data.alert);
        setShowNotification(true);
        
        // Update alert list if available
        if (window.updateAlertList && window.updateAlertList.addAlert) {
          window.updateAlertList.addAlert(data.alert);
        }
        
        // Auto-hide notification after 15 seconds
        setTimeout(() => setShowNotification(false), 15000);
      }

      if (data.type === 'alert-update') {
        console.log('Alert updated:', data.alert);
        
        // Update alert list if available
        if (window.updateAlertList && window.updateAlertList.updateAlert) {
          window.updateAlertList.updateAlert(data.alert);
        }
      }

      if (data.type === 'alert-dismissed') {
        console.log('Alert dismissed:', data.alertId);
        
        if (latestAlert && latestAlert._id === data.alertId) {
          setShowNotification(false);
        }
        
        // Remove from alert list if available
        if (window.updateAlertList && window.updateAlertList.removeAlert) {
          window.updateAlertList.removeAlert(data.alertId);
        }
      }
    } catch (error) {
      console.error('Error parsing SSE message:', error);
    }
  }, [latestAlert]);

  // Establish SSE connection
  const connectToSSE = useCallback(() => {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      console.error('No admin token found');
      return;
    }

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setConnectionStatus('connecting');
    console.log('Connecting to SSE...');

    const eventSource = new EventSource(`/api/admin/alerts/stream?token=${token}`);

    eventSource.onopen = (e) => {
      console.log('SSE connection opened', e);
      setConnectionStatus('connected');
    };

    eventSource.onmessage = (e) => {
      console.log('SSE onmessage triggered:', e);
      handleMessage(e);
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      console.log('EventSource readyState:', eventSource.readyState);
      setConnectionStatus('error');
      
      eventSource.close();
      
      // Retry connection after 5 seconds
      setTimeout(() => {
        console.log('Retrying SSE connection...');
        connectToSSE();
      }, 5000);
    };

    eventSourceRef.current = eventSource;
  }, [handleMessage]);

  // Request notification permission
  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('Notification permission after request:', permission);
      setNotificationPermission(permission);
    }
  };

  // Establish connection on mount
  useEffect(() => {
    connectToSSE();

    return () => {
      if (eventSourceRef.current) {
        console.log('Closing SSE connection on unmount');
        eventSourceRef.current.close();
      }
    };
  }, [connectToSSE]);

  const handleViewDetails = () => {
    if (latestAlert) {
      window.location.href = `/admin/alerts/${latestAlert._id}`;
    }
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  return (
    <>
      {/* Connection Status Indicator */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-lg border">
        {connectionStatus === 'connected' ? (
          <>
            <Wifi className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 font-semibold">Live</span>
          </>
        ) : connectionStatus === 'connecting' ? (
          <>
            <Wifi className="w-4 h-4 text-yellow-500 animate-pulse" />
            <span className="text-sm text-yellow-600">Connecting...</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-600">Disconnected</span>
          </>
        )}
        
        {/* Notification permission indicator */}
        {notificationPermission !== 'granted' && (
          <button
            onClick={requestPermission}
            className="ml-2 flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200"
            title="Enable notifications"
          >
            <BellOff className="w-3 h-3" />
            Enable
          </button>
        )}
      </div>

      {/* Custom Notification Popup */}
      {showNotification && latestAlert && (
        <CustomNotification
          alert={latestAlert}
          onClose={handleCloseNotification}
          onViewDetails={handleViewDetails}
        />
      )}
    </>
  );
}
