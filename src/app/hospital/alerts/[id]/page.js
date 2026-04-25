"use client";
import { fetchWithProgress } from '@/lib/fetchWithProgess';
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

// ── config ────────────────────────────────────────────────────────────────────

const TYPE_CFG = {
  high:   { label: 'HIGH',   bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', dot: '#EF4444' },
  medium: { label: 'MEDIUM', bg: '#FFFBEB', border: '#FDE68A', text: '#D97706', dot: '#F59E0B' },
  low:    { label: 'LOW',    bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB', dot: '#3B82F6' },
  ignore: { label: 'IGNORE', bg: '#F9FAFB', border: '#E5E7EB', text: '#6B7280', dot: '#9CA3AF' },
};

const STATUS_CFG = {
  pending:      { label: 'Pending',      bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  acknowledged: { label: 'Acknowledged', bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  in_progress:  { label: 'In Progress',  bg: '#F5F3FF', text: '#6D28D9', border: '#DDD6FE' },
  resolved:     { label: 'Resolved',     bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
  dismissed:    { label: 'Dismissed',    bg: '#F9FAFB', text: '#6B7280', border: '#E5E7EB' },
};

const CATEGORY_ICON = { sos: '🆘', medication: '💊', ai_prediction: '🤖', manual: '✋' };

const fmtDate = (v) =>
  v ? new Date(v).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
const fmtVal = (v) =>
  v === null || v === undefined || v === '' ? '—' : String(v);

// ── primitives ────────────────────────────────────────────────────────────────

const s = {
  card: {
    background: '#fff',
    border: '1px solid #E5E7EB',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 20px',
    borderBottom: '1px solid #F3F4F6',
    background: '#FAFAFA',
  },
  cardHeaderLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#9CA3AF',
    margin: 0,
  },
  cardBody: { padding: '20px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px 32px',
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: 500,
    color: '#111827',
    wordBreak: 'break-all',
  },
  fieldValueMuted: {
    fontSize: 13,
    fontWeight: 400,
    color: '#6B7280',
    fontFamily: 'monospace',
    wordBreak: 'break-all',
  },
};

function Card({ title, icon, children }) {
  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <span style={{ fontSize: 14 }}>{icon}</span>
        <p style={s.cardHeaderLabel}>{title}</p>
      </div>
      <div style={s.cardBody}>{children}</div>
    </div>
  );
}

function Field({ label, value, muted, wide, mono }) {
  return (
    <div style={wide ? { gridColumn: '1 / -1' } : {}}>
      <p style={s.fieldLabel}>{label}</p>
      <p style={mono ? s.fieldValueMuted : muted ? { ...s.fieldValue, color: '#6B7280' } : s.fieldValue}>
        {fmtVal(value)}
      </p>
    </div>
  );
}

function PriorityBar({ value }) {
  const color = value >= 4 ? '#EF4444' : value === 3 ? '#F59E0B' : '#3B82F6';
  return (
    <div style={{ gridColumn: '1 / -1' }}>
      <p style={s.fieldLabel}>Priority</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <div key={n} style={{
            flex: 1, height: 6, borderRadius: 99,
            background: n <= value ? color : '#E5E7EB',
            boxShadow: n <= value && value >= 4 ? '0 0 6px rgba(239,68,68,0.4)' : 'none',
            transition: 'all .2s',
          }} />
        ))}
        <span style={{ marginLeft: 6, fontSize: 13, fontWeight: 600, color: '#374151' }}>{value}/5</span>
      </div>
    </div>
  );
}

function TagPills({ label, items }) {
  return (
    <div style={{ gridColumn: '1 / -1' }}>
      <p style={s.fieldLabel}>{label}</p>
      {items?.length ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
          {items.map((item, i) => (
            <span key={i} style={{
              padding: '4px 12px', borderRadius: 99, fontSize: 12,
              background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB',
            }}>{item}</span>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 13, color: '#D1D5DB', fontStyle: 'italic' }}>None recorded</p>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div>
      {[80, 140, 200, 160].map((h, i) => (
        <div key={i} style={{
          height: h, borderRadius: 16, background: '#F3F4F6',
          marginBottom: 16, animation: 'pulse 1.5s ease-in-out infinite',
        }} />
      ))}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────

export default function AlertPage() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res    = await fetchWithProgress('/api/alerts/' + id);
        const result = await res.json();
        setData(result);
      } catch (e) {
        setError('Failed to load alert. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const type   = TYPE_CFG[data?.alert_type]  ?? TYPE_CFG.ignore;
  const status = STATUS_CFG[data?.status]    ?? STATUS_CFG.pending;
  const lat    = data?.sos_location?.latitude;
  const lng    = data?.sos_location?.longitude;
  const mapUrl = lat ? `https://maps.google.com/?q=${lat},${lng}` : null;

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', padding: '32px 16px', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap'); audio{width:100%;accent-color:#EF4444;}`}</style>

      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        {/* ── header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>{CATEGORY_ICON[data?.category] ?? '🔔'}</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#9CA3AF' }}>
                {data?.category?.replace('_', ' ') ?? 'Alert'}
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#111827' }}>
              {loading ? 'Loading…' : (data?.alert_id ?? 'Alert Detail')}
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#9CA3AF' }}>{fmtDate(data?.createdAt)}</p>
          </div>

          {/* severity badge */}
          {data?.alert_type && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', borderRadius: 12,
              background: type.bg, border: `1.5px solid ${type.border}`,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: type.dot,
                boxShadow: `0 0 0 3px ${type.bg}, 0 0 0 4px ${type.dot}40`,
                animation: 'ping 1.5s ease-in-out infinite',
              }} />
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.15em', color: type.text }}>
                {type.label}
              </span>
            </div>
          )}
        </div>
        <style>{`@keyframes ping{0%,100%{box-shadow:0 0 0 3px var(--bg),0 0 0 4px var(--dot) 40}50%{box-shadow:0 0 0 5px var(--bg),0 0 0 7px transparent}}`}</style>

        {loading && <Skeleton />}
        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '14px 20px', color: '#DC2626', fontSize: 14 }}>
            {error}
          </div>
        )}

        {!loading && !error && data && (<>

          {/* status + priority */}
          <Card title="Status" icon="🔄">
            <div style={s.grid}>
              <div>
                <p style={s.fieldLabel}>Status</p>
                <span style={{
                  display: 'inline-block', padding: '4px 14px', borderRadius: 99,
                  fontSize: 12, fontWeight: 600,
                  background: status.bg, color: status.text, border: `1px solid ${status.border}`,
                }}>{status.label}</span>
              </div>
              {data.priority != null && <PriorityBar value={data.priority} />}
            </div>
          </Card>

          {/* patient */}
          <Card title="Patient" icon="👤">
            <div style={s.grid}>
              <Field label="Name"       value={data.patient_name} />
              <Field label="Age"        value={data.patient_age != null ? `${data.patient_age} years` : undefined} />
              <Field label="Phone"      value={data.patient_phone} />
              <Field label="Patient ID" value={data.patient_id} mono />
            </div>
          </Card>

          {/* SOS */}
          {data.category === 'sos' && (
            <Card title="SOS Details" icon="🆘">

              {/* audio */}
              <p style={s.fieldLabel}>Audio Recording</p>
              {data.sos_audio_url ? (
                <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 12, padding: 12, marginBottom: 20 }}>
                  <audio controls src={data.sos_audio_url} />
                </div>
              ) : (
                <p style={{ ...s.fieldValue, color: '#D1D5DB', marginBottom: 20 }}>No audio available</p>
              )}

              <div style={s.grid}>
                {/* transcription */}
                {data.sos_transcription && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <p style={s.fieldLabel}>Transcription</p>
                    <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, padding: '12px 16px' }}>
                      <p style={{ margin: 0, fontSize: 14, color: '#374151', fontStyle: 'italic', lineHeight: 1.6 }}>
                        {`"${data.sos_transcription}"`}
                      </p>
                    </div>
                  </div>
                )}

                {/* duration */}
                <Field label="Duration" value={data.sos_duration != null ? `${data.sos_duration} seconds` : undefined} />

                {/* location */}
                <div>
                  <p style={s.fieldLabel}>Location</p>
                  {mapUrl ? (
                    <a href={mapUrl} target="_blank" rel="noopener noreferrer"
                       style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#2563EB', textDecoration: 'none', fontWeight: 500 }}>
                      📍 {lat.toFixed(5)}, {lng.toFixed(5)}
                      <span style={{ fontSize: 10, opacity: 0.6 }}>↗</span>
                    </a>
                  ) : (
                    <p style={{ ...s.fieldValue, color: '#D1D5DB' }}>—</p>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* medication */}
          {data.category === 'medication' && (
            <Card title="Medication Details" icon="💊">
              <div style={s.grid}>
                <Field label="Medication"         value={data.medication_name} />
                <Field label="Consecutive Missed" value={data.consecutive_missed} />
                <Field label="Total Missed"       value={data.total_missed} />
                <Field label="Last Taken"         value={fmtDate(data.last_taken_date)} />
              </div>
            </Card>
          )}

          {/* AI analysis */}
          <Card title="AI Analysis" icon="🤖">
            <div style={s.grid}>
              {data.ai_confidence != null && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={s.fieldLabel}>Confidence</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1, height: 6, borderRadius: 99, background: '#E5E7EB', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 99,
                        background: 'linear-gradient(90deg, #7C3AED, #3B82F6)',
                        width: `${(data.ai_confidence * 100).toFixed(0)}%`,
                      }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', minWidth: 40 }}>
                      {(data.ai_confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
              <TagPills label="Risk Factors"    items={data.ai_risk_factors ?? []} />
              <TagPills label="Recommendations" items={data.ai_recommendations ?? []} />
            </div>
          </Card>

          {/* description */}
          {data.description && (
            <Card title="Description" icon="📝">
              <p style={{ margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.7 }}>{data.description}</p>
            </Card>
          )}

          {/* workflow */}
          {(data.assigned_to || data.acknowledged_at || data.resolved_at || data.resolution_notes) && (
            <Card title="Workflow" icon="⚙️">
              <div style={s.grid}>
                {data.assigned_to     && <Field label="Assigned To"      value={fmtVal(data.assigned_to)} />}
                {data.acknowledged_at && <Field label="Acknowledged At"  value={fmtDate(data.acknowledged_at)} />}
                {data.resolved_at     && <Field label="Resolved At"      value={fmtDate(data.resolved_at)} />}
                {data.resolution_notes && <Field label="Resolution Notes" value={data.resolution_notes} wide />}
              </div>
            </Card>
          )}

          {/* meta */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px', fontSize: 11, color: '#9CA3AF', marginTop: 8, paddingLeft: 4 }}>
            <span>ID: <span style={{ fontFamily: 'monospace' }}>{data._id}</span></span>
            <span>Created: {fmtDate(data.createdAt)}</span>
            <span>Updated: {fmtDate(data.updatedAt)}</span>
          </div>

        </>)}
      </div>
    </div>
  );
}