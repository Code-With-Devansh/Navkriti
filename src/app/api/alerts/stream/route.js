// app/api/admin/alerts/stream/route.js
import { NextResponse } from 'next/server';
import { checkPermission } from '@/middleware/adminAuth';

// Store active connections
const clients = new Set();

export async function GET(request) {
  try {
    const auth = await checkPermission(request, 'view_patients');
    
    if (auth.error) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    // Create SSE stream
    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        const encoder = new TextEncoder();
        const message = `data: ${JSON.stringify({ type: 'connected', timestamp: new Date() })}\n\n`;
        controller.enqueue(encoder.encode(message));

        // Store connection info
        const client = {
          controller,
          encoder,
          adminId: auth.admin._id.toString(),
        };
        
        clients.add(client);

        // Keep alive ping every 30 seconds
        const keepAlive = setInterval(() => {
          try {
            const ping = `data: ${JSON.stringify({ type: 'ping' })}\n\n`;
            controller.enqueue(encoder.encode(ping));
          } catch (error) {
            clearInterval(keepAlive);
            clients.delete(client);
          }
        }, 30000);

        // Cleanup on disconnect
        request.signal.addEventListener('abort', () => {
          clearInterval(keepAlive);
          clients.delete(client);
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('SSE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to establish connection' },
      { status: 500 }
    );
  }
}

// Helper function to broadcast to all connected admins
export function broadcastToAdmins(event) {
  const encoder = new TextEncoder();
  const message = `data: ${JSON.stringify(event)}\n\n`;
  
  for (const client of clients) {
    try {
      client.controller.enqueue(encoder.encode(message));
    } catch (error) {
      console.error('Failed to send to client:', error);
      clients.delete(client);
    }
  }
}

// Export for use in other routes
export { clients };