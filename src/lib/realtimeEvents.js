// lib/realtimeEvents.js

// In-memory event emitter for Next.js
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error('Event listener error:', error);
        }
      });
    }
  }

  off(event, listenerToRemove) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(
      listener => listener !== listenerToRemove
    );
  }
}

// Global event emitter instance
const globalEvents = new EventEmitter();

// Helper to emit alert events
export function emitNewAlert(alert) {
  globalEvents.emit('new-alert', {
    type: 'new-alert',
    alert: {
      id: alert._id,
      alert_id: alert.alert_id,
      category: alert.category,
      alert_type: alert.alert_type,
      patient_name: alert.patient_name,
      patient_phone: alert.patient_phone,
      patient_age: alert.patient_age,
      sos_audio_url: alert.sos_audio_url,
      sos_transcription: alert.sos_transcription,
      sos_duration: alert.sos_duration,
      status: alert.status,
      priority: alert.priority,
      created_at: alert.createdAt,
    },
    timestamp: new Date(),
  });
}

export function emitAlertUpdate(alert) {
  globalEvents.emit('alert-updated', {
    type: 'alert-updated',
    alert: {
      id: alert._id,
      status: alert.status,
      acknowledged_at: alert.acknowledged_at,
      resolved_at: alert.resolved_at,
    },
    timestamp: new Date(),
  });
}

export default globalEvents;