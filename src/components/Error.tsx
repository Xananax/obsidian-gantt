import * as React from 'react'
import styles from './Error.module.css'

const ErrorComponent = ({children}: { children: React.ReactNode | undefined}) => 
  <div className={styles.main}>
    <p>{children}</p>
  </div>

export default ErrorComponent