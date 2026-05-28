import { useEffect, useRef, RefObject } from 'react'
import useStore from '@/store/store'
import { Tool } from '@/types'

const SYNTH_MOUSE_WINDOW_MS = 600

/**
 * Layered around react-zoom-pan-pinch's gesture detection. Owns:
 * - Multi-touch detection on touchstart so a fast 2-finger pinch (one that
 *   doesn't trip the library's movement threshold) still flips the tool to
 *   `pan` for the duration of the gesture.
 * - Restoring the previous tool when all fingers lift.
 * - Swallowing the mouse / pointer events iOS synthesizes after touchend so
 *   they don't reach the canvas's native drawing listeners (which see
 *   pointerType='mouse' as a real mouse interaction otherwise).
 *
 * Returns idempotent enter/exit helpers so the library's onPinchStart /
 * onPinchStop can also drive the same state machine without duplicating it.
 */
export const useCanvasViewport = (
  viewportRef: RefObject<HTMLElement | null>,
) => {
  const setTool = useStore((state) => state.setTool)
  const previousToolRef = useRef<Tool['type'] | null>(null)

  // Idempotent so both our multi-touch listener and the library's onPinchStart
  // can call it without double-saving the tool.
  const enterPanFromGesture = () => {
    if (previousToolRef.current !== null) return
    const current = useStore.getState().tool
    if (current.type === 'pan') return
    previousToolRef.current = current.type
    setTool({ type: 'pan' })
  }

  const exitPanIfAllTouchesUp = (remainingTouches: number) => {
    if (remainingTouches > 0) return
    if (previousToolRef.current === null) return
    setTool({ type: previousToolRef.current })
    previousToolRef.current = null
  }

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    let lastTouchAt = 0

    const onTouchStart = (e: TouchEvent) => {
      lastTouchAt = Date.now()
      // 2+ fingers means a pinch / 2-finger pan even if the library hasn't
      // recognised it yet (its onPinchStart only fires after a movement
      // threshold). Flip to pan immediately.
      if (e.touches.length >= 2) enterPanFromGesture()
    }
    const onTouchMoveOrEnd = (e: TouchEvent) => {
      lastTouchAt = Date.now()
      if (e.type === 'touchend' || e.type === 'touchcancel') {
        exitPanIfAllTouchesUp(e.touches.length)
      }
    }

    // iOS dispatches synthesized mouse events (mousedown/mouseup/click) and
    // synthesized pointer events with pointerType='mouse' a few frames after
    // the final touchend. Capture-phase + stopImmediatePropagation kills
    // them before any drawing handler or the library's pointer handlers see
    // them. Real touch-driven pointer events fire with pointerType='touch'
    // and are explicitly let through.
    const swallowSynthMouse = (e: Event) => {
      if ('pointerType' in e && (e as PointerEvent).pointerType !== 'mouse') {
        return
      }
      if (Date.now() - lastTouchAt < SYNTH_MOUSE_WINDOW_MS) {
        e.stopImmediatePropagation()
        if (e.cancelable) e.preventDefault()
      }
    }

    viewport.addEventListener('touchstart', onTouchStart, { passive: true })
    viewport.addEventListener('touchmove', onTouchMoveOrEnd, { passive: true })
    viewport.addEventListener('touchend', onTouchMoveOrEnd, { passive: true })
    viewport.addEventListener('touchcancel', onTouchMoveOrEnd, {
      passive: true,
    })
    const captureOpts = { capture: true } as AddEventListenerOptions
    viewport.addEventListener('mousedown', swallowSynthMouse, captureOpts)
    viewport.addEventListener('mouseup', swallowSynthMouse, captureOpts)
    viewport.addEventListener('click', swallowSynthMouse, captureOpts)
    viewport.addEventListener('pointerdown', swallowSynthMouse, captureOpts)
    viewport.addEventListener('pointermove', swallowSynthMouse, captureOpts)
    viewport.addEventListener('pointerup', swallowSynthMouse, captureOpts)
    viewport.addEventListener('pointercancel', swallowSynthMouse, captureOpts)
    return () => {
      viewport.removeEventListener('touchstart', onTouchStart)
      viewport.removeEventListener('touchmove', onTouchMoveOrEnd)
      viewport.removeEventListener('touchend', onTouchMoveOrEnd)
      viewport.removeEventListener('touchcancel', onTouchMoveOrEnd)
      const removeCapture = { capture: true } as EventListenerOptions
      viewport.removeEventListener('mousedown', swallowSynthMouse, removeCapture)
      viewport.removeEventListener('mouseup', swallowSynthMouse, removeCapture)
      viewport.removeEventListener('click', swallowSynthMouse, removeCapture)
      viewport.removeEventListener(
        'pointerdown',
        swallowSynthMouse,
        removeCapture,
      )
      viewport.removeEventListener(
        'pointermove',
        swallowSynthMouse,
        removeCapture,
      )
      viewport.removeEventListener(
        'pointerup',
        swallowSynthMouse,
        removeCapture,
      )
      viewport.removeEventListener(
        'pointercancel',
        swallowSynthMouse,
        removeCapture,
      )
    }
    // setTool / refs / enterPanFromGesture / exitPanIfAllTouchesUp are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewportRef, setTool])

  return { enterPanFromGesture, exitPanIfAllTouchesUp }
}
