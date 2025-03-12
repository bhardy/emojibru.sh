import { useEffect, useRef, RefObject, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react'
import { useDrawingStatus } from '../hooks/useDrawingStatus'
import { Painting } from '@/types'
import css from './Canvas.module.css'

type DrawFunctionType = (y: number, x: number) => void
type DrawEventType = ReactMouseEvent<HTMLCanvasElement> | ReactTouchEvent<HTMLCanvasElement>
type CanvasRefType = RefObject<HTMLCanvasElement | null>

// retina -- times 2
const R = 2
// multiplier -- cell size
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
  ctx.translate(OS,OS)
  ctx.textBaseline = 'top' 

  grid.forEach((row: string[], yi: number) => {
    row.forEach((cell: string, xi: number) => {
      ctx.fillText(cell, xi * MP, yi * MP)
    })
  })

  // restores the translation to 0,0
  ctx.restore()
}

  const getRelativePosition = (canvasRef: CanvasRefType, e: DrawEventType) => {
  const canvas = canvasRef.current
  if (!canvas) return { cx: -1, cy: -1 }
  const rect = canvas.getBoundingClientRect()

  // grab either the touch events (if they exist) or the mouse events
  const x = 'touches' in e ? e.touches[0]?.clientX || (e as ReactTouchEvent<HTMLCanvasElement>).changedTouches[0]?.clientX : (e as ReactMouseEvent<HTMLCanvasElement>).clientX
  const y = 'touches' in e ? e.touches[0]?.clientY || (e as ReactTouchEvent<HTMLCanvasElement>).changedTouches[0]?.clientY : (e as ReactMouseEvent<HTMLCanvasElement>).clientY

  // clicked cell (zero-indexed)
  const cx = Math.ceil((x - rect.left) / MP * R) - 1
  const cy = Math.ceil((y - rect.top) / MP * R) - 1

  return { cx, cy }
}

const handleCanvasClick = (canvasRef: CanvasRefType, e: DrawEventType, draw: DrawFunctionType) => {
  const {cx, cy} = getRelativePosition(canvasRef, e)
  if (cx >= 0 && cy >= 0) {
    draw(cy, cx)
  }
}

const handleCanvasDrag = (canvasRef: CanvasRefType, e: DrawEventType, draw: DrawFunctionType, isDrawing: boolean) => {
  const {cx, cy} = getRelativePosition(canvasRef, e)
  if (isDrawing && cx >= 0 && cy >= 0) {
    draw(cy, cx)
  }
}

interface CanvasProps extends Painting {
  draw: (y: number, x: number) => void
}

const Canvas = ({ grid, draw, width, height }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useDrawingStatus(canvasRef)

  useEffect(() => {
    drawing(canvasRef, grid)
  }, [width, height, grid])

  // @note: the style is 1/2 the width & height for retina
  const pixelSize = {
    width: width * MP,
    height: height * MP
  }

  return (
    <div className={css.wrapper}>
      <canvas
        id="emojibrush-canvas"
        ref={canvasRef}
        width={pixelSize.width}
        height={pixelSize.height}
        style={{ width: pixelSize.width / 2, height: pixelSize.height / 2 }}
        onMouseDown={(e) => handleCanvasClick(canvasRef, e, draw)}
        onTouchEnd={(e) => handleCanvasClick(canvasRef, e, draw)}
        onMouseMove={(e) => handleCanvasDrag(canvasRef, e, draw, isDrawing)}
        onTouchMove={(e) => handleCanvasDrag(canvasRef, e, draw, isDrawing)}
      />
    </div>
  )
}

export default Canvas
