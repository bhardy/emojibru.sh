import { useEffect, useState, RefObject } from 'react'

export const useMouseStatus = <T extends HTMLElement>(
  containerRef: RefObject<T | null>,
) => {
  const [mouseStatus, setMouseStatus] = useState<'mouseup' | 'mousedown'>(
    'mouseup',
  )

  useEffect(() => {
    const container = containerRef?.current
    if (!container) return

    const setMouseFromEvent = (event: MouseEvent) =>
      setMouseStatus(event.type as 'mouseup' | 'mousedown')

    container.addEventListener('mousedown', setMouseFromEvent)
    container.addEventListener('mouseup', setMouseFromEvent)

    return () => {
      container.removeEventListener('mousedown', setMouseFromEvent)
      container.removeEventListener('mouseup', setMouseFromEvent)
    }
  }, [containerRef])

  return mouseStatus
}

export const useTouchStatus = <T extends HTMLElement>(
  containerRef: RefObject<T | null>,
) => {
  const [touchStatus, setTouchStatus] = useState<
    'touchstart' | 'touchend' | 'touchcancel'
  >('touchend')

  useEffect(() => {
    const container = containerRef?.current
    if (!container) return

    const setTouchFromEvent = (event: TouchEvent) => {
      // prevent scrolling while drawing
      event.preventDefault()
      setTouchStatus(event.type as 'touchstart' | 'touchend' | 'touchcancel')
    }

    container.addEventListener('touchstart', setTouchFromEvent, {
      passive: false,
    })
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

export const useDrawingStatus = <T extends HTMLElement>(
  containerRef: RefObject<T | null>,
) => {
  const [isDrawing, setIsDrawing] = useState(false)

  const mouseStatus = useMouseStatus(containerRef)
  const touchStatus = useTouchStatus(containerRef)

  useEffect(() => {
    setIsDrawing(mouseStatus === 'mousedown' || touchStatus === 'touchstart')
  }, [mouseStatus, touchStatus])

  return isDrawing
}
