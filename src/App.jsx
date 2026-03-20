import { useState } from 'react'
import FormularioCliente from './components/FormularioCliente'
import PanelRevision from './components/PanelRevision'
import Configuracion from './components/Configuracion'
import styles from './App.module.css'

export default function App() {
  const [vista, setVista] = useState('form')

  const tabs = [
    { id: 'form', label: 'Solicitud' },
    { id: 'revision', label: 'Revisión' },
    { id: 'config', label: 'Configuración' },
  ]

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <span className={styles.brandDot} />
            <span className={styles.brandName}>Facturación</span>
          </div>
          <nav className={styles.nav}>
            {tabs.map(t => (
              <button
                key={t.id}
                className={`${styles.tab} ${vista === t.id ? styles.tabActive : ''}`}
                onClick={() => setVista(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        {vista === 'form' && <FormularioCliente />}
        {vista === 'revision' && <PanelRevision />}
        {vista === 'config' && <Configuracion />}
      </main>

      <footer className={styles.footer}>
        <span>Sistema de facturación</span>
      </footer>
    </div>
  )
}
