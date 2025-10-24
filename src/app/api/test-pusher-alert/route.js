// app/api/test-pusher-alert/route.js
import { triggerNewAlert } from '@/lib/pusher';

export async function POST(request) {
  try {
    const body = await request.json();
    const { testAlert } = body;

    console.log('Sending test alert via Pusher:', testAlert);

    // Trigger the alert via Pusher
    const success = await triggerNewAlert(testAlert);

    if (success) {
      return Response.json({ 
        success: true, 
        message: 'Test alert sent successfully' 
      });
    } else {
      throw new Error('Failed to trigger Pusher event');
    }
  } catch (error) {
    console.error('Error in test alert:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
