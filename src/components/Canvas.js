import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useDrawingStatus } from '../hooks/useDrawingStatus'
import css from './Canvas.module.css'

// retina -- times 2
const R = 2
// multiplier -- cell size
const MP = 32 * R
// offset -- buffer
const OS = 4 * R

const drawing = (canvasRef, grid) => {
  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')

  ctx.font = `${26 * R}px sans-serif`
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.save()
  ctx.translate(OS,OS)
  ctx.textBaseline = 'top' 

  grid.forEach((row, yi) => {
    row.forEach((cell, xi) => {
      ctx.fillText(cell, xi * MP, yi * MP)
    })
  })

  // restores the translation to 0,0
  ctx.restore()
}

const getRelativePosition = (canvasRef, e) => {
  const canvas = canvasRef.current
  const rect = canvas.getBoundingClientRect()

  // grab either the touch events (if they exist) or the mouse events
  const x = e.touches ? e.touches[0]?.clientX || e.changedTouches[0]?.clientX : e.clientX
  const y = e.touches ? e.touches[0]?.clientY || e.changedTouches[0]?.clientY : e.clientY

  // clicked cell (zero-indexed)
  const cx = Math.ceil((x - rect.left) / MP * R) - 1
  const cy = Math.ceil((y - rect.top) / MP * R) - 1

  return { cx, cy }
}

const handleCanvasClick = (canvasRef, e, draw) => {
  const {cx, cy} = getRelativePosition(canvasRef, e)

  draw(cy, cx)
}

const handleCanvasDrag = (canvasRef, e, draw, isDrawing) => {
  const {cx, cy} = getRelativePosition(canvasRef, e)

  if (isDrawing) {
    draw(cy, cx)
  }
}

const Canvas = ({ grid, draw, width, height }) => {
  const canvasRef = useRef(null)
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

Canvas.propTypes = {
  grid: PropTypes.array.isRequired,
  draw: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
}

export default Canvas
