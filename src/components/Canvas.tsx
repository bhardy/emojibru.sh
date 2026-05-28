import { useEffect, useRef, RefObject } from 'react'
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchContentRef,
} from 'react-zoom-pan-pinch'
import { useDrawingStatus } from '../hooks/useDrawingStatus'
import { useCanvasViewport } from '../hooks/useCanvasViewport'
import useStore from '../store/store'
import { Painting } from '@/types'
import css from './Canvas.module.css'

type CanvasRefType = RefObject<HTMLCanvasElement | null>

// pixel-density factor; higher = sharper at zoom but more memory
const R = 4
// multiplier -- cell size in canvas pixels
const MP = 32 * R
// offset -- buffer
const OS = 4 * R

const drawing = (canvasRef: CanvasRefType, grid: Painting['grid']) => {
  const canvas = canvasRef.current
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.font = `${26 * R}px sans-serif`
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.save()
  ctx.translate(OS, OS)
  ctx.textBaseline = 'top'

  grid.forEach((row: string[], yi: number) => {
    row.forEach((cell: string, xi: number) => {
      ctx.fillText(cell, xi * MP, yi * MP)
    })
  })

  ctx.restore()
}

const getCellFromEvent = (
  canvasRef: CanvasRefType,
  e: TouchEvent | MouseEvent,
  width: number,
  height: number,
) => {
  const canvas = canvasRef.current
  if (!canvas) return { cx: -1, cy: -1 }
  const rect = canvas.getBoundingClientRect()

  let clientX: number | undefined
  let clientY: number | undefined
  if ('touches' in e) {
    const t = e.touches[0] || e.changedTouches[0]
    clientX = t?.clientX
    clientY = t?.clientY
  } else {
    clientX = (e as MouseEvent).clientX
    clientY = (e as MouseEvent).clientY
  }
  if (clientX === undefined || clientY === undefined)
    return { cx: -1, cy: -1 }

  // rect already reflects react-zoom-pan-pinch's CSS transform, so a 0..1
  // ratio against rect.width/height gives the correct cell.
  const cx = Math.floor(((clientX - rect.left) / rect.width) * width)
  const cy = Math.floor(((clientY - rect.top) / rect.height) * height)
  return { cx, cy }
}

interface CanvasProps extends Painting {
  draw: (y: number, x: number) => void
}

const Canvas = ({ grid, draw, width, height }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const isDrawing = useDrawingStatus(canvasRef)
  const isDrawingRef = useRef(isDrawing)
  isDrawingRef.current = isDrawing
  const drawRef = useRef(draw)
  drawRef.current = draw
  const widthRef = useRef(width)
  widthRef.current = width
  const heightRef = useRef(height)
  heightRef.current = height

  const tool = useStore((state) => state.tool)
  const isPanning = tool.type === 'pan'

  const { enterPanFromGesture, exitPanIfAllTouchesUp } =
    useCanvasViewport(viewportRef)

  const transformRef = useRef<ReactZoomPanPinchContentRef>(null)

  // Fit the painting to the viewport on mount and whenever the painting is
  // resized. Scales down (never up) so a big painting fits the screen and a
  // small one stays at natural pixel size. `requestAnimationFrame` retries
  // while initial layout is still settling (iOS reports 0 for clientHeight
  // until paint completes).
  useEffect(() => {
    let raf = 0
    const fit = () => {
      const wrapper = transformRef.current
      const viewport = viewportRef.current
      // The canvas's parent is our .wrapper div — the actual transformable
      // content. offsetWidth/Height is the layout (pre-transform) box.
      const content = canvasRef.current?.parentElement
      if (!wrapper || !viewport || !content) return
      const vw = viewport.clientWidth
      const vh = viewport.clientHeight
      const cw = content.offsetWidth
      const ch = content.offsetHeight
      if (!vw || !vh || !cw || !ch) {
        raf = requestAnimationFrame(fit)
        return
      }
      const fitScale = Math.min(vw / cw, vh / ch, 1)
      wrapper.centerView(fitScale, 0)
    }
    raf = requestAnimationFrame(fit)
    return () => cancelAnimationFrame(raf)
  }, [width, height])

  // Native drawing listeners on the canvas. These fire in target phase,
  // before react-zoom-pan-pinch's bubble-phase callbacks restore the tool,
  // so a touchend mid-pinch never sees the freshly-restored tool. The
  // listener also reads tool live via useStore.getState() so a stale React
  // closure can't draw during a pinch either.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const isPan = () => useStore.getState().tool.type === 'pan'

    const handleClick = (e: TouchEvent | MouseEvent) => {
      if (isPan()) return
      const { cx, cy } = getCellFromEvent(
        canvasRef,
        e,
        widthRef.current,
        heightRef.current,
      )
      if (cx >= 0 && cy >= 0) drawRef.current(cy, cx)
    }
    const handleDrag = (e: TouchEvent | MouseEvent) => {
      if (isPan()) return
      if (!isDrawingRef.current) return
      const { cx, cy } = getCellFromEvent(
        canvasRef,
        e,
        widthRef.current,
        heightRef.current,
      )
      if (cx >= 0 && cy >= 0) drawRef.current(cy, cx)
    }

    canvas.addEventListener('touchend', handleClick)
    canvas.addEventListener('touchmove', handleDrag)
    canvas.addEventListener('mousedown', handleClick)
    canvas.addEventListener('mousemove', handleDrag)
    return () => {
      canvas.removeEventListener('touchend', handleClick)
      canvas.removeEventListener('touchmove', handleDrag)
      canvas.removeEventListener('mousedown', handleClick)
      canvas.removeEventListener('mousemove', handleDrag)
    }
  }, [])

  useEffect(() => {
    drawing(canvasRef, grid)
  }, [width, height, grid])

  const pixelSize = {
    width: width * MP,
    height: height * MP,
  }

  return (
    <div
      ref={viewportRef}
      className={css.viewport}
      data-pan={isPanning ? 'true' : 'false'}
    >
      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={0.1}
        maxScale={2}
        centerOnInit
        limitToBounds={false}
        // autoAlignment runs after every wheel-zoom (via
        // handleAlignToScaleBounds → handleAlignToBounds → animate), nudging
        // the canvas back toward the library's internal bounds even with
        // limitToBounds=false. That manifested as the canvas drifting on its
        // own after a zoom. Disable.
        autoAlignment={{ disabled: true }}
        doubleClick={{ disabled: true }}
        panning={{
          disabled: !isPanning,
          velocityDisabled: true,
        }}
        pinch={{ disabled: false }}
        wheel={{
          // Wheel zoom is always available so users can zoom regardless of
          // the active tool. Only mouse-drag panning is gated by isPanning.
          disabled: false,
          // step multiplies |event.deltaY| each wheel tick (lib default
          // smooth=true). 0.1 is the lib's documented default and is far
          // too fast on a regular mouse wheel where deltaY ~ 100/tick.
          step: 0.025,
        }}
        onPinchStart={enterPanFromGesture}
        onPinchStop={(_, event) => {
          exitPanIfAllTouchesUp(event.touches.length)
        }}
      >
        {/* The TransformComponent wrapper fills our viewport so the library
            can clip / position; the content stays fit-content so the white
            .wrapper sizes exactly to the canvas + padding. */}
        <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
          <div className={css.wrapper}>
            <canvas
              id="emojibrush-canvas"
              ref={canvasRef}
              width={pixelSize.width}
              height={pixelSize.height}
              style={{
                width: pixelSize.width / R,
                height: pixelSize.height / R,
              }}
            />
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}

export default Canvas
