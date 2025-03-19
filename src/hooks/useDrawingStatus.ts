import useStore from '@/store/store'
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

    const handleMouseLeave = () => setMouseStatus('mouseup')

    container.addEventListener('mousedown', setMouseFromEvent)
    container.addEventListener('mouseup', setMouseFromEvent)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousedown', setMouseFromEvent)
      container.removeEventListener('mouseup', setMouseFromEvent)
      container.removeEventListener('mouseleave', handleMouseLeave)
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

  // Touch screen panning state
  const { touchPanning } = useStore()

  useEffect(() => {
    const container = containerRef?.current
    if (!container) return

    console.log('touchPanning', touchPanning)
    if (touchPanning) return setTouchStatus('touchcancel')

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
  }, [containerRef, touchPanning])

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
