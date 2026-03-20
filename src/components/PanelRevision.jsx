import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { EMAILJS_CONFIG } from '../emailConfig'
import styles from './PanelRevision.module.css'

export default function PanelRevision() {
  const [solicitudes, setSolicitudes] = useState(() =>
    JSON.parse(localStorage.getItem('solicitudes') || '[]')
  )
  const [motivoId, setMotivoId] = useState(null)
  const [motivo, setMotivo] = useState('')
  const [procesando, setProcesando] = useState(null)

  const pendientes = solicitudes.filter(s => s.status === 'pendiente')
  const historial = solicitudes.filter(s => s.status !== 'pendiente')

  const actualizar = (id, cambios) => {
    const nuevas = solicitudes.map(s => s.id === id ? { ...s, ...cambios } : s)
    setSolicitudes(nuevas)
    localStorage.setItem('solicitudes', JSON.stringify(nuevas))
  }

  const aprobar = async (s) => {
    setProcesando(s.id)
    const correoContador = localStorage.getItem('cfg_contador') || ''
    const montoFormateado = parseFloat(s.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })
    try {
      if (correoContador && EMAILJS_CONFIG.SERVICE_ID !== 'TU_SERVICE_ID') {
        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_CONTADOR,
          {
            to_email: correoContador,
            titulo: 'Solicitud aprobada — proceder con factura',
            asunto: `Factura aprobada — ${s.razon}`,
            mensaje_intro: 'Esta solicitud fue aprobada. Por favor procede con la emisión de la factura.',
            razon_social: s.razon,
            rfc: s.rfc,
            regimen: s.regimen,
            cfdi: s.cfdi,
            email_cliente: s.emailCliente,
            cp: s.cp,
            descripcion: s.descripcion,
            monto: montoFormateado,
            detalle: `CP: ${s.cp} | Correo cliente: ${s.emailCliente}`,
            fecha: s.fecha,
          },
          EMAILJS_CONFIG.PUBLIC_KEY
        )
      }
    } catch (e) { console.error(e) }
    actualizar(s.id, { status: 'aprobado' })
    setProcesando(null)
  }

  const rechazar = async (s) => {
    if (!motivo.trim()) return
    setProcesando(s.id)
    try {
      if (EMAILJS_CONFIG.SERVICE_ID !== 'TU_SERVICE_ID') {
        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_RECHAZO,
          {
            to_email: s.emailCliente,
            titulo: 'Tu solicitud requiere corrección',
            asunto: `Solicitud de facturación — requiere corrección`,
            mensaje_intro: `Hola, tu solicitud fue revisada y requiere algunos cambios antes de continuar.`,
            razon_social: s.razon,
            rfc: s.rfc,
            descripcion: s.descripcion,
            detalle: motivo,
            fecha: s.fecha,
          },
          EMAILJS_CONFIG.PUBLIC_KEY
        )
      }
    } catch (e) { console.error(e) }
    actualizar(s.id, { status: 'rechazado', motivo })
    setMotivoId(null)
    setMotivo('')
    setProcesando(null)
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Panel de revisión</h1>
        <p className={styles.subtitle}>
          {pendientes.length === 0 ? 'No hay solicitudes pendientes.' : `${pendientes.length} solicitud${pendientes.length > 1 ? 'es' : ''} pendiente${pendientes.length > 1 ? 's' : ''}.`}
        </p>
      </div>

      {pendientes.length === 0 && historial.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>○</div>
          <p>Las solicitudes de clientes aparecerán aquí.</p>
        </div>
      )}

      {pendientes.map(s => (
        <div key={s.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <div className={styles.cardName}>{s.razon}</div>
              <div className={styles.cardSub}>{s.fecha}</div>
            </div>
            <span className={`${styles.badge} ${styles.badgePending}`}>Pendiente</span>
          </div>

          <div className={styles.dataGrid}>
            <div className={styles.dataRow}><span>RFC</span><strong>{s.rfc}</strong></div>
            <div className={styles.dataRow}><span>Régimen</span><strong>{s.regimen}</strong></div>
            <div className={styles.dataRow}><span>CFDI</span><strong>{s.cfdi}</strong></div>
            <div className={styles.dataRow}><span>CP</span><strong>{s.cp}</strong></div>
            <div className={styles.dataRow}><span>Correo cliente</span><strong>{s.emailCliente}</strong></div>
            <div className={styles.dataRow}><span>Servicio</span><strong>{s.descripcion}</strong></div>
            <div className={styles.dataRow}><span>Monto</span><strong>${parseFloat(s.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</strong></div>
            {s.obs && <div className={styles.dataRow}><span>Observaciones</span><strong>{s.obs}</strong></div>}
          </div>

          <div className={styles.actions}>
            <button className={styles.btnApprove} onClick={() => aprobar(s)} disabled={procesando === s.id}>
              {procesando === s.id ? 'Procesando...' : 'Aprobar y enviar al contador'}
            </button>
            <button className={styles.btnReject} onClick={() => { setMotivoId(motivoId === s.id ? null : s.id); setMotivo('') }}>
              Rechazar
            </button>
          </div>

          {motivoId === s.id && (
            <div className={styles.rejectBox}>
              <label className={styles.rejectLabel}>Motivo del rechazo</label>
              <textarea value={motivo} onChange={e => setMotivo(e.target.value)} placeholder="Ej: El RFC no coincide con la razón social..." />
              <button className={styles.btnConfirmReject} onClick={() => rechazar(s)} disabled={!motivo.trim() || procesando === s.id}>
                Confirmar rechazo y notificar al cliente
              </button>
            </div>
          )}
        </div>
      ))}

      {historial.length > 0 && (
        <div className={styles.historialSection}>
          <div className={styles.historialTitle}>Historial</div>
          {historial.map(s => (
            <div key={s.id} className={`${styles.card} ${styles.cardMuted}`}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.cardName}>{s.razon}</div>
                  <div className={styles.cardSub}>{s.fecha} · {s.descripcion}</div>
                </div>
                <span className={`${styles.badge} ${s.status === 'aprobado' ? styles.badgeApproved : styles.badgeRejected}`}>
                  {s.status === 'aprobado' ? 'Aprobado' : 'Rechazado'}
                </span>
              </div>
              {s.motivo && <div className={styles.motivoTag}>Motivo: {s.motivo}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
