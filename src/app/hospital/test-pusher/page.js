// app/admin/test-pusher/page.js
'use client';

import { usePusher } from '@/contexts/PusherContext';

export default function TestPusherPage() {
  const { pusher, isConnected } = usePusher();

  const sendTestAlert = async () => {
    try {
      const response = await fetch('/api/test-pusher-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testAlert: {
            _id: 'test-' + Date.now(),
            alert_id: `TEST-${Date.now()}`,
            alert_type: 'high',
            category: 'sos',
            patient_name: 'Test Patient',
            patient_phone: '9876543210',
            patient_age: 30,
            sos_transcription: 'This is a test emergency alert',
            sos_location: 'Test Hospital, Dehradun',
            sos_duration: 5,
            status: 'pending',
            priority: 5,
            created_at: new Date().toISOString(),
          }
        }),
      });

      const result = await response.json();
      console.log('Test alert sent:', result);
      alert('Test alert sent! Check the admin dashboard.');
    } catch (error) {
      console.error('Error sending test alert:', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Test Pusher Integration</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <p className="text-lg">
            Connection Status: 
            <span className={`ml-2 font-bold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? '✅ Connected' : '❌ Disconnected'}
            </span>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Pusher Instance: {pusher ? '✅ Initialized' : '❌ Not initialized'}
          </p>
        </div>

        <button
          onClick={sendTestAlert}
          disabled={!isConnected}
          className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Send Test Alert
        </button>

        <div className="mt-4 p-4 bg-blue-50 rounded">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Ensure you're connected (green status above)</li>
            <li>Open the admin alerts page in another tab</li>
            <li>Click "Send Test Alert" button</li>
            <li>Check if notification appears on alerts page</li>
            <li>Verify alert appears in the list instantly</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
