import { useEffect, useState } from 'react'

export const useMouseStatus = (containerRef) => {
  const [mouseStatus, setMouseStatus] = useState('mouseup')

  useEffect(() => {
    const container = containerRef?.current
    if (!container) return

    const setMouseFromEvent = event => setMouseStatus(event.type)

    container.addEventListener('mousedown', setMouseFromEvent)
    container.addEventListener('mouseup', setMouseFromEvent)

    return () => {
      container.removeEventListener('mousedown', setMouseFromEvent)
      container.removeEventListener('mouseup', setMouseFromEvent)
    }
  }, [containerRef])

  return mouseStatus
}

export const useTouchStatus = (containerRef) => {
  const [touchStatus, setTouchStatus] = useState('touchend')

  useEffect(() => {
    const container = containerRef?.current
    if (!container) return

    const setTouchFromEvent = event => {
      // prevent scrolling while drawing
      event.preventDefault()
      setTouchStatus(event.type)
    }

    container.addEventListener('touchstart', setTouchFromEvent, { passive: false })
    container.addEventListener('touchend', setTouchFromEvent)
    container.addEventListener('touchcancel', setTouchFromEvent)

    return () => {
      container.removeEventListener('touchstart', setTouchFromEvent)
      container.removeEventListener('touchend', setTouchFromEvent)
      container.removeEventListener('touchcancel', setTouchFromEvent)
    }
  }, [containerRef])

  return touchStatus
}

export const useDrawingStatus = (containerRef) => {
  const [isDrawing, setIsDrawing] = useState(false)

  const mouseStatus = useMouseStatus(containerRef)
  const touchStatus = useTouchStatus(containerRef)

  useEffect(() => {
    setIsDrawing(
      mouseStatus === 'mousedown' || 
      touchStatus === 'touchstart'
    )
  }, [mouseStatus, touchStatus])

  return isDrawing
}