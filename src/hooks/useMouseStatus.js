import { useEffect, useState } from 'react'

export const useMouseStatus = () => {
  const [mouseStatus, setMouseStatus] = useState('mouseup')

  useEffect(() => {
    const setMouseFromEvent = event => setMouseStatus(event.type)

    window.addEventListener('mousedown', setMouseFromEvent)
    window.addEventListener('mouseup', setMouseFromEvent)

    return () => {
      window.removeEventListener('mousedown', setMouseFromEvent)
      window.removeEventListener('mouseup', setMouseFromEvent)
    }
  }, [])

  return mouseStatus
}
