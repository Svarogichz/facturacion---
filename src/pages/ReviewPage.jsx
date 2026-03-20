import { useState } from 'react'
import { showToast } from '../components/Toast.jsx'

export default function ReviewPage({ solicitudes, updateSolicitud, config }) {
  const [motivos, setMotivos] = useState({})
  const [rejectOpen, setRejectOpen] = useState({})

  const pendientes = solicitudes.filter(s => s.status === 'pendiente')
  const procesadas = solicitudes.filter(s => s.status !== 'pendiente')

  const aprobar = (s) => {
    if (!config.contador) {
      showToast('Configura el correo del contador primero')
      return
    }
    updateSolicitud(s.id, { status: 'aprobado' })
    showToast('Aprobado. Correo enviado al contador.')
    // emailjs.send(...) — agregar cuando configures EmailJS
  }

  const rechazar = (s) => {
    const motivo = motivos[s.id] || ''
    if (!motivo.trim()) { showToast('Escribe el motivo del rechazo'); return }
    updateSolicitud(s.id, { status: 'rechazado', motivo })
    setRejectOpen(r => ({ ...r, [s.id]: false }))
    showToast('Rechazado. Notificación enviada al cliente.')
    // emailjs.send(...) — agregar cuando configures EmailJS
  }

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '6px' }}>Revisión de solicitudes</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          {pendientes.length === 0 ? 'No hay solicitudes pendientes.' : `${pendientes.length} solicitud${pendientes.length > 1 ? 'es' : ''} pendiente${pendientes.length > 1 ? 's' : ''}.`}
        </p>
      </div>

      {pendientes.length === 0 && procesadas.length === 0 && (
        <div style={emptyState}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📭</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Aún no hay solicitudes de clientes.</p>
        </div>
      )}

      {pendientes.map(s => (
        <div key={s.id} style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{ fontWeight: '500', fontSize: '15px' }}>{s.razon}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{s.fecha}</div>
            </div>
            <span style={badge('pending')}>Pendiente</span>
          </div>
          <div style={grid}>
            <DataRow label="RFC" value={s.rfc} mono />
            <DataRow label="CP" value={s.cp} />
            <DataRow label="Régimen" value={s.regimen} />
            <DataRow label="CFDI" value={s.cfdi} />
            <DataRow label="Servicio" value={s.descripcion} />
            <DataRow label="Monto" value={`$${parseFloat(s.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`} />
            <DataRow label="Correo cliente" value={s.emailCliente} />
            {s.obs && <DataRow label="Observaciones" value={s.obs} full />}
          </div>

          {!rejectOpen[s.id] && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
              <button onClick={() => aprobar(s)} style={btnApprove}>Aprobar y enviar al contador</button>
              <button onClick={() => setRejectOpen(r => ({ ...r, [s.id]: true }))} style={btnReject}>Rechazar</button>
            </div>
          )}

          {rejectOpen[s.id] && (
            <div style={{ marginTop: '16px', padding: '16px', background: 'var(--danger-bg)', borderRadius: 'var(--radius)', border: '1px solid #F5C6C2' }}>
              <label style={{ fontSize: '12px', color: 'var(--danger)', display: 'block', marginBottom: '8px', fontWeight: '500' }}>Motivo del rechazo</label>
              <textarea
                value={motivos[s.id] || ''}
                onChange={e => setMotivos(m => ({ ...m, [s.id]: e.target.value }))}
                placeholder="Ej: RFC incorrecto, falta información fiscal..."
                style={{ marginBottom: '10px' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => rechazar(s)} style={btnRejectConfirm}>Confirmar y notificar al cliente</button>
                <button onClick={() => setRejectOpen(r => ({ ...r, [s.id]: false }))} style={btnCancel}>Cancelar</button>
              </div>
            </div>
          )}
        </div>
      ))}

      {procesadas.length > 0 && (
        <>
          <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-hint)', textTransform: 'uppercase', letterSpacing: '0.09em', margin: '28px 0 14px' }}>Historial</div>
          {procesadas.map(s => (
            <div key={s.id} style={{ ...cardStyle, opacity: 0.75 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '500', fontSize: '14px' }}>{s.razon}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{s.descripcion} · ${parseFloat(s.monto).toLocaleString('es-MX')} MXN</div>
                </div>
                <span style={badge(s.status)}>{s.status === 'aprobado' ? 'Aprobado' : 'Rechazado'}</span>
              </div>
              {s.motivo && <div style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '10px' }}>Motivo: {s.motivo}</div>}
            </div>
          ))}
        </>
      )}
    </div>
  )
}

function DataRow({ label, value, mono, full }) {
  return (
    <div style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
      <div style={{ fontSize: '11px', color: 'var(--text-hint)', marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontFamily: mono ? 'var(--mono)' : 'inherit', wordBreak: 'break-word' }}>{value}</div>
    </div>
  )
}

const badge = (status) => ({
  display: 'inline-block',
  fontSize: '11px',
  fontWeight: '500',
  padding: '4px 10px',
  borderRadius: '100px',
  background: status === 'pending' ? 'var(--warning-bg)' : status === 'aprobado' ? 'var(--success-bg)' : 'var(--danger-bg)',
  color: status === 'pending' ? 'var(--warning)' : status === 'aprobado' ? 'var(--success)' : 'var(--danger)',
})

const cardStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)',
  padding: '20px 22px',
  marginBottom: '12px',
  boxShadow: 'var(--shadow)',
}

const grid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px 20px',
}

const emptyState = {
  textAlign: 'center',
  padding: '48px 20px',
  background: 'var(--surface)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border)',
}

const btnApprove = {
  padding: '10px 16px',
  background: 'var(--success)',
  color: '#fff',
  borderRadius: 'var(--radius)',
  fontSize: '13px',
  fontWeight: '500',
  flex: 1,
}

const btnReject = {
  padding: '10px 16px',
  background: 'var(--surface)',
  color: 'var(--danger)',
  border: '1px solid var(--danger)',
  borderRadius: 'var(--radius)',
  fontSize: '13px',
  fontWeight: '500',
}

const btnRejectConfirm = {
  padding: '9px 14px',
  background: 'var(--danger)',
  color: '#fff',
  borderRadius: 'var(--radius)',
  fontSize: '13px',
  fontWeight: '500',
  flex: 1,
}

const btnCancel = {
  padding: '9px 14px',
  background: 'transparent',
  color: 'var(--text-secondary)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  fontSize: '13px',
}
