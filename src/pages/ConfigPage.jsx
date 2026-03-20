import { useState } from 'react'
import { showToast } from '../components/Toast.jsx'

export default function ConfigPage({ config, setDuena, setContador }) {
  const [localDuena, setLocalDuena] = useState(config.duena)
  const [localContador, setLocalContador] = useState(config.contador)

  const guardar = (quien) => {
    const val = quien === 'duena' ? localDuena : localContador
    if (!val.trim() || !/\S+@\S+\.\S+/.test(val)) {
      showToast('Escribe un correo válido')
      return
    }
    if (quien === 'duena') setDuena(val.trim())
    else setContador(val.trim())
    showToast('Correo guardado correctamente')
  }

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '6px' }}>Configuración</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Administra los correos del flujo de aprobación.</p>
      </div>

      <div style={cardStyle}>
        <div style={sectionTitle}>Correos del flujo</div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Correo de la dueña <span style={{ color: 'var(--text-hint)' }}>(quien aprueba o rechaza)</span></label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <input
              type="email"
              value={localDuena}
              onChange={e => setLocalDuena(e.target.value)}
              placeholder="duena@empresa.com"
            />
            <button onClick={() => guardar('duena')} style={btnSave}>Guardar</button>
          </div>
          {config.duena && <div style={savedTag}>✓ {config.duena}</div>}
        </div>

        <div>
          <label style={labelStyle}>Correo del contador <span style={{ color: 'var(--text-hint)' }}>(recibe cuando se aprueba)</span></label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <input
              type="email"
              value={localContador}
              onChange={e => setLocalContador(e.target.value)}
              placeholder="contador@empresa.com"
            />
            <button onClick={() => guardar('contador')} style={btnSave}>Guardar</button>
          </div>
          {config.contador && <div style={savedTag}>✓ {config.contador}</div>}
        </div>
      </div>

      <div style={cardStyle}>
        <div style={sectionTitle}>Flujo de aprobación</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { color: '#378ADD', text: 'Cliente llena el formulario y envía' },
            { color: '#EF9F27', text: 'Dueña recibe correo y revisa la solicitud' },
            { color: '#1D9E75', text: 'Si aprueba → correo automático al contador' },
            { color: '#C0392B', text: 'Si rechaza → correo de regreso al cliente con el motivo' },
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: step.color + '18', border: `1px solid ${step.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: step.color }} />
              </div>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{step.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...cardStyle, background: '#FEFDF9', borderColor: '#E8E4D4' }}>
        <div style={sectionTitle}>Sobre EmailJS</div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '12px' }}>
          Para que los correos se envíen de verdad, necesitas configurar EmailJS. Es gratis y se conecta a Gmail.
        </p>
        <a href="https://www.emailjs.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
          Ir a emailjs.com →
        </a>
        <p style={{ fontSize: '12px', color: 'var(--text-hint)', marginTop: '8px' }}>
          Una vez que tengas tu cuenta, abre el archivo <code style={{ fontFamily: 'var(--mono)', background: 'var(--surface-2)', padding: '1px 5px', borderRadius: '4px' }}>src/emailConfig.js</code> y llena tus claves.
        </p>
      </div>
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

const labelStyle = {
  fontSize: '13px',
  color: 'var(--text-primary)',
  fontWeight: '400',
}

const btnSave = {
  padding: '10px 16px',
  background: 'var(--text-primary)',
  color: '#fff',
  borderRadius: 'var(--radius)',
  fontSize: '13px',
  fontWeight: '500',
  whiteSpace: 'nowrap',
}

const savedTag = {
  fontSize: '12px',
  color: 'var(--success)',
  marginTop: '6px',
  fontFamily: 'var(--mono)',
}
