// app/api/admin/alerts/stream/route.js
export const dynamic = 'force-dynamic';

// Store active admin connections in memory
let clients = [];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return new Response('Unauthorized', { status: 401 });
    }

    // TODO: Optionally verify token here if needed
    // For now, we'll trust it since it's from admin localStorage

    const encoder = new TextEncoder();
    let isClosed = false;

    const stream = new ReadableStream({
      start(controller) {
        // Send connection success message
        const connectMsg = `data: ${JSON.stringify({ 
          type: 'connected', 
          message: 'Successfully connected to alert stream',
          timestamp: new Date().toISOString() 
        })}\n\n`;
        controller.enqueue(encoder.encode(connectMsg));

        // Create client object
        const clientId = Date.now() + Math.random();
        const client = {
          id: clientId,
          controller,
          encoder,
          send: (data) => {
            if (!isClosed) {
              try {
                const message = `data: ${JSON.stringify(data)}\n\n`;
                controller.enqueue(encoder.encode(message));
              } catch (error) {
                console.error('Error sending to client:', error);
              }
            }
          }
        };

        clients.push(client);
        console.log(`✅ Admin connected to SSE. Total: ${clients.length}`);

        // Keep-alive ping
        const keepAliveInterval = setInterval(() => {
          if (!isClosed) {
            try {
              const ping = `data: ${JSON.stringify({ type: 'ping' })}\n\n`;
              controller.enqueue(encoder.encode(ping));
            } catch (error) {
              clearInterval(keepAliveInterval);
              isClosed = true;
            }
          }
        }, 30000);

        // Cleanup on disconnect
        const cleanup = () => {
          clearInterval(keepAliveInterval);
          isClosed = true;
          clients = clients.filter(c => c.id !== clientId);
          console.log(`❌ Admin disconnected. Remaining: ${clients.length}`);
          try {
            controller.close();
          } catch (e) {
            // Already closed
          }
        };

        request.signal.addEventListener('abort', cleanup);
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    console.error('SSE error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// Helper function to broadcast alerts to all connected admins
export function broadcastAlert(alertData) {
  console.log(`📢 Broadcasting alert to ${clients.length} admin(s)`);
  
  const message = {
    type: 'new-alert',
    alert: alertData,
    timestamp: new Date().toISOString(),
  };

  let sentCount = 0;
  clients.forEach(client => {
    try {
      client.send(message);
      sentCount++;
    } catch (error) {
      console.error('Failed to send to client:', error);
    }
  });

  console.log(`✅ Alert sent to ${sentCount}/${clients.length} admin(s)`);
  return sentCount;
}

// Export clients for other routes to use
export { clients };