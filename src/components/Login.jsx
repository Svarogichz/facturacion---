import { useState } from 'react'
import styles from './Login.module.css'

const PASSWORD = 'admin1234'

export default function Login({ onLogin }) {
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)

  const intentar = () => {
    if (pass === PASSWORD) {
      onLogin()
    } else {
      setError(true)
      setPass('')
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.dot} />
        <h1 className={styles.title}>Panel de administración</h1>
        <p className={styles.sub}>Ingresa la contraseña para continuar</p>
        <input
          type="password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && intentar()}
          placeholder="Contraseña"
          className={error ? styles.inputError : ''}
          autoFocus
        />
        {error && <p className={styles.error}>Contraseña incorrecta</p>}
        <button className={styles.btn} onClick={intentar}>Entrar</button>
      </div>
    </div>
  )
}
