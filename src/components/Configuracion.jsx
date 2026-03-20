import { useState } from 'react'
import styles from './Configuracion.module.css'

export default function Configuracion() {
  const [duena, setDuena] = useState(localStorage.getItem('cfg_duena') || '')
  const [contador, setContador] = useState(localStorage.getItem('cfg_contador') || '')
  const [saved, setSaved] = useState('')

  const guardar = (quien, valor) => {
    if (!valor.trim()) return
    localStorage.setItem('cfg_' + quien, valor.trim())
    setSaved(quien)
    setTimeout(() => setSaved(''), 2000)
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Configuración</h1>
        <p className={styles.subtitle}>Administra los correos del flujo de aprobación.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.sectionLabel}>Correos del flujo</div>

        <div className={styles.configItem}>
          <div className={styles.configInfo}>
            <div className={styles.configName}>Dueña — quien revisa y aprueba</div>
            <div className={styles.configDesc}>Recibe un correo cada vez que un cliente envía una solicitud.</div>
          </div>
          <div className={styles.configInput}>
            <input
              type="email"
              value={duena}
              onChange={e => setDuena(e.target.value)}
              placeholder="duena@empresa.com"
            />
            <button className={styles.btnSave} onClick={() => guardar('duena', duena)}>
              {saved === 'duena' ? '✓ Guardado' : 'Guardar'}
            </button>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.configItem}>
          <div className={styles.configInfo}>
            <div className={styles.configName}>Contador — recibe facturas aprobadas</div>
            <div className={styles.configDesc}>Solo recibe correo cuando la dueña aprueba una solicitud.</div>
          </div>
          <div className={styles.configInput}>
            <input
              type="email"
              value={contador}
              onChange={e => setContador(e.target.value)}
              placeholder="contador@empresa.com"
            />
            <button className={styles.btnSave} onClick={() => guardar('contador', contador)}>
              {saved === 'contador' ? '✓ Guardado' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.sectionLabel}>Flujo de aprobación</div>
        <div className={styles.flow}>
          {[
            { color: '#378ADD', label: 'Cliente llena el formulario y envía la solicitud' },
            { color: '#EF9F27', label: 'La dueña recibe un correo y decide si aprueba o rechaza' },
            { color: '#1D9E75', label: 'Si aprueba → el contador recibe los datos por correo' },
            { color: '#E24B4A', label: 'Si rechaza → el cliente recibe el motivo por correo' },
          ].map((step, i) => (
            <div key={i} className={styles.flowStep}>
              <div className={styles.flowDot} style={{ background: step.color }} />
              <span>{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.sectionLabel}>EmailJS — cómo configurar los correos reales</div>
        <ol className={styles.steps}>
          <li>Ve a <a href="https://www.emailjs.com" target="_blank" rel="noreferrer">emailjs.com</a> y crea una cuenta gratuita.</li>
          <li>Conecta tu cuenta de Gmail en <strong>Email Services</strong>.</li>
          <li>Crea 3 plantillas en <strong>Email Templates</strong>: una para la dueña, una para el contador y una para rechazo.</li>
          <li>Copia tu <strong>Service ID</strong>, <strong>Public Key</strong> y los 3 <strong>Template IDs</strong>.</li>
          <li>Pégalos en el archivo <code>src/emailConfig.js</code> del proyecto.</li>
        </ol>
      </div>
    </div>
  )
}
