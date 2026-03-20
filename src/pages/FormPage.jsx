import { useState } from 'react'
import { showToast } from '../components/Toast.jsx'

const REGIMENES = [
  '601 - General de Ley Personas Morales',
  '603 - Personas Morales con Fines no Lucrativos',
  '612 - Personas Físicas con Actividades Empresariales',
  '621 - Incorporación Fiscal',
  '625 - Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas',
  '626 - Régimen Simplificado de Confianza',
]

const CFDIS = [
  'G01 - Adquisición de mercancias',
  'G03 - Gastos en general',
  'I01 - Construcciones',
  'I04 - Equipo de cómputo y accesorios',
  'P01 - Por definir',
  'S01 - Sin efectos fiscales',
]

const field = {
  label: { fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '5px', display: 'block', fontWeight: '400', letterSpacing: '0.01em' },
  group: { display: 'flex', flexDirection: 'column' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' },
  rowFull: { display: 'grid', gridTemplateColumns: '1fr', gap: '14px', marginBottom: '14px' },
}

export default function FormPage({ addSolicitud }) {
  const [form, setForm] = useState({
    razon: '', rfc: '', regimen: '', cfdi: '',
    emailCliente: '', cp: '', descripcion: '', monto: '', obs: ''
  })
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async () => {
    const required = ['razon', 'rfc', 'regimen', 'cfdi', 'emailCliente', 'cp', 'descripcion', 'monto']
    if (required.some(k => !form[k])) {
      showToast('Por favor llena todos los campos obligatorios')
      return
    }
    if (!/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i.test(form.rfc.trim())) {
      showToast('El RFC no parece válido')
      return
    }
    setLoading(true)
    try {
      addSolicitud(form)
      setForm({ razon: '', rfc: '', regimen: '', cfdi: '', emailCliente: '', cp: '', descripcion: '', monto: '', obs: '' })
      showToast('Solicitud enviada. La dueña la revisará pronto.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '6px' }}>Solicitud de facturación</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Llena tus datos fiscales y los enviaremos para revisión.</p>
      </div>

      {/* Card: Datos fiscales */}
      <div style={cardStyle}>
        <div style={sectionTitle}>Datos fiscales</div>
        <div style={field.row}>
          <div style={field.group}>
            <label style={field.label}>Razón social *</label>
            <input value={form.razon} onChange={set('razon')} placeholder="Mi Empresa S.A. de C.V." />
          </div>
          <div style={field.group}>
            <label style={field.label}>RFC *</label>
            <input value={form.rfc} onChange={set('rfc')} placeholder="EMP901012AB1" style={{ fontFamily: 'var(--mono)', letterSpacing: '0.05em' }} />
          </div>
        </div>
        <div style={field.row}>
          <div style={field.group}>
            <label style={field.label}>Régimen fiscal *</label>
            <select value={form.regimen} onChange={set('regimen')}>
              <option value="">Seleccionar...</option>
              {REGIMENES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div style={field.group}>
            <label style={field.label}>Uso de CFDI *</label>
            <select value={form.cfdi} onChange={set('cfdi')}>
              <option value="">Seleccionar...</option>
              {CFDIS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={field.row}>
          <div style={field.group}>
            <label style={field.label}>Correo para recibir factura *</label>
            <input type="email" value={form.emailCliente} onChange={set('emailCliente')} placeholder="correo@empresa.com" />
          </div>
          <div style={field.group}>
            <label style={field.label}>Código postal *</label>
            <input value={form.cp} onChange={set('cp')} placeholder="64000" maxLength={5} />
          </div>
        </div>
      </div>

      {/* Card: Detalle del servicio */}
      <div style={cardStyle}>
        <div style={sectionTitle}>Detalle del servicio</div>
        <div style={field.row}>
          <div style={field.group}>
            <label style={field.label}>Descripción del servicio *</label>
            <input value={form.descripcion} onChange={set('descripcion')} placeholder="Consultoría de sistemas" />
          </div>
          <div style={field.group}>
            <label style={field.label}>Monto total (MXN) *</label>
            <input type="number" value={form.monto} onChange={set('monto')} placeholder="5000.00" min="0" />
          </div>
        </div>
        <div style={field.rowFull}>
          <div style={field.group}>
            <label style={field.label}>Observaciones <span style={{ color: 'var(--text-hint)' }}>(opcional)</span></label>
            <textarea value={form.obs} onChange={set('obs')} placeholder="Notas adicionales para la factura..." />
          </div>
        </div>
      </div>

      <button onClick={handleSubmit} disabled={loading} style={btnPrimary}>
        {loading ? 'Enviando...' : 'Enviar solicitud para revisión →'}
      </button>
    </div>
  )
}

const cardStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)',
  padding: '20px 22px',
  marginBottom: '14px',
  boxShadow: 'var(--shadow)',
}

const sectionTitle = {
  fontSize: '11px',
  fontWeight: '500',
  color: 'var(--text-hint)',
  textTransform: 'uppercase',
  letterSpacing: '0.09em',
  marginBottom: '16px',
  paddingBottom: '10px',
  borderBottom: '1px solid var(--border)',
}

const btnPrimary = {
  width: '100%',
  padding: '13px',
  background: 'var(--text-primary)',
  color: '#fff',
  borderRadius: 'var(--radius)',
  fontSize: '14px',
  fontWeight: '500',
  marginTop: '4px',
  letterSpacing: '0.01em',
}
