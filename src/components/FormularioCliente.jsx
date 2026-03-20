import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { EMAILJS_CONFIG } from '../emailConfig'
import styles from './FormularioCliente.module.css'

const REGIMENES = [
  '601 - General de Ley Personas Morales',
  '603 - Personas Morales con Fines no Lucrativos',
  '606 - Arrendamiento',
  '612 - Personas Físicas con Actividades Empresariales',
  '621 - Incorporación Fiscal',
  '626 - Régimen Simplificado de Confianza (RESICO)',
]

const CFDIS = [
  'G01 - Adquisición de mercancias',
  'G03 - Gastos en general',
  'I04 - Equipo de cómputo y accesorios',
  'P01 - Por definir',
  'S01 - Sin efectos fiscales del comprobante',
]

export default function FormularioCliente() {
  const [form, setForm] = useState({
    razon: '', rfc: '', regimen: '', cfdi: '',
    emailCliente: '', cp: '', descripcion: '',
    monto: '', obs: ''
  })
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [emailClienteGuardado, setEmailClienteGuardado] = useState('')
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validar = () => {
    const reqs = ['razon', 'rfc', 'regimen', 'cfdi', 'emailCliente', 'cp', 'descripcion', 'monto']
    return reqs.every(k => form[k].trim() !== '')
  }

  const guardarLocal = (solicitud) => {
    const prev = JSON.parse(localStorage.getItem('solicitudes') || '[]')
    prev.push(solicitud)
    localStorage.setItem('solicitudes', JSON.stringify(prev))
  }

  const enviar = async () => {
    if (!validar()) { setError('Por favor completa todos los campos obligatorios.'); return }
    setError('')
    setEnviando(true)

    const solicitud = {
      id: Date.now(),
      ...form,
      status: 'pendiente',
      fecha: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })
    }

    guardarLocal(solicitud)
    setEmailClienteGuardado(form.emailCliente)

    const correoDestino = localStorage.getItem('cfg_duena') || ''
    const montoFormateado = parseFloat(form.monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })

    try {
      if (correoDestino && EMAILJS_CONFIG.SERVICE_ID !== 'TU_SERVICE_ID') {
        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_DUENA,
          {
            to_email: correoDestino,
            titulo: 'Nueva solicitud de facturación',
            asunto: `Nueva solicitud — ${form.razon}`,
            mensaje_intro: `Tienes una nueva solicitud de ${form.razon} pendiente de revisión.`,
            razon_social: form.razon,
            rfc: form.rfc,
            regimen: form.regimen,
            cfdi: form.cfdi,
            email_cliente: form.emailCliente,
            cp: form.cp,
            descripcion: form.descripcion,
            monto: montoFormateado,
            observaciones: form.obs || 'Ninguna',
            detalle: `Monto: $${montoFormateado} MXN | CP: ${form.cp}`,
            fecha: solicitud.fecha,
          },
          EMAILJS_CONFIG.PUBLIC_KEY
        )
      }
      setEnviado(true)
      setForm({ razon: '', rfc: '', regimen: '', cfdi: '', emailCliente: '', cp: '', descripcion: '', monto: '', obs: '' })
    } catch (e) {
      console.error(e)
      setError('Solicitud guardada, pero hubo un error al enviar el correo. Verifica tu configuración de EmailJS.')
      setEnviado(true)
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>✓</div>
        <h2>Solicitud enviada</h2>
        <p>Tu solicitud fue recibida y está en revisión. Te notificaremos al correo <strong>{emailClienteGuardado}</strong> con el resultado.</p>
        <button className={styles.btnSecondary} onClick={() => setEnviado(false)}>Nueva solicitud</button>
      </div>
    )
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Solicitud de facturación</h1>
        <p className={styles.subtitle}>Completa el formulario y nos pondremos en contacto contigo.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.sectionLabel}>Datos fiscales</div>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label>Razón social <span className={styles.req}>*</span></label>
            <input value={form.razon} onChange={e => set('razon', e.target.value)} placeholder="Empresa S.A. de C.V." />
          </div>
          <div className={styles.field}>
            <label>RFC <span className={styles.req}>*</span></label>
            <input value={form.rfc} onChange={e => set('rfc', e.target.value.toUpperCase())} placeholder="EMP901012AB1" maxLength={13} />
          </div>
        </div>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label>Régimen fiscal <span className={styles.req}>*</span></label>
            <select value={form.regimen} onChange={e => set('regimen', e.target.value)}>
              <option value="">Seleccionar...</option>
              {REGIMENES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label>Uso de CFDI <span className={styles.req}>*</span></label>
            <select value={form.cfdi} onChange={e => set('cfdi', e.target.value)}>
              <option value="">Seleccionar...</option>
              {CFDIS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label>Correo para recibir factura <span className={styles.req}>*</span></label>
            <input type="email" value={form.emailCliente} onChange={e => set('emailCliente', e.target.value)} placeholder="correo@empresa.com" />
          </div>
          <div className={styles.field}>
            <label>Código postal <span className={styles.req}>*</span></label>
            <input value={form.cp} onChange={e => set('cp', e.target.value)} placeholder="64000" maxLength={5} />
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.sectionLabel}>Detalle del servicio</div>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label>Descripción del servicio <span className={styles.req}>*</span></label>
            <input value={form.descripcion} onChange={e => set('descripcion', e.target.value)} placeholder="Consultoría de sistemas" />
          </div>
          <div className={styles.field}>
            <label>Monto total (MXN) <span className={styles.req}>*</span></label>
            <input type="number" value={form.monto} onChange={e => set('monto', e.target.value)} placeholder="5000.00" min="0" />
          </div>
        </div>
        <div className={styles.field}>
          <label>Observaciones <span className={styles.opt}>(opcional)</span></label>
          <textarea value={form.obs} onChange={e => set('obs', e.target.value)} placeholder="Notas adicionales para la revisión..." />
        </div>
      </div>

      {error && <div className={styles.errorMsg}>{error}</div>}

      <button className={styles.btnPrimary} onClick={enviar} disabled={enviando}>
        {enviando ? 'Enviando...' : 'Enviar solicitud para revisión →'}
      </button>
    </div>
  )
}
