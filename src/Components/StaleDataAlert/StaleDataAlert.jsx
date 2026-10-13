import React from 'react'
import './StaleDataAlert.css'

const DAY_MS = 24 * 60 * 60 * 1000

function StaleDataAlert ({ staleSince, now }) {
  if (!staleSince) return null
  const elapsedMs = now - new Date(staleSince)
  if (elapsedMs <= DAY_MS) return null

  const days = Math.floor(elapsedMs / DAY_MS)
  return (
    <div className='staledataalert' role='status'>
      Última actualización hace {days} {days === 1 ? 'día' : 'días'}
    </div>
  )
}

export default StaleDataAlert
