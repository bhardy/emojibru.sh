import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useMouseStatus } from '../hooks/useMouseStatus'
import css from './Canvas.module.css'

// multiplier -- cell size
const MP = 32
// offset -- buffer
const OS = 4

const drawing = (canvasRef, grid) => {
  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')  
  ctx.font = "26px sans-serif"

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

  // get grid position
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  // clicked cell (zero-indexed)
  const cx = Math.ceil(x / MP) - 1
  const cy = Math.ceil(y / MP) - 1

  return { cx, cy }
}

const handleCanvasClick = (canvasRef, e, draw) => {
  const {cx, cy} = getRelativePosition(canvasRef, e)

  draw(cy, cx)
}

const handleCanvasDrag = (canvasRef, e, draw, mouseStatus) => {
  const {cx, cy} = getRelativePosition(canvasRef, e)

  if (mouseStatus === 'mousedown') {
    draw(cy, cx)
  }
}

const Canvas = ({ grid, draw, width, height }) => {
  const canvasRef = useRef(null)
  const mouseStatus = useMouseStatus()

  useEffect(() => {
    drawing(canvasRef, grid)
  }, [width, height, grid])

  return (
    <div className={css.wrapper}>
      <canvas
        id="emojibrush-canvas"
        ref={canvasRef}
        width={width * MP}
        height={height * MP}
        onMouseDown={(e) => handleCanvasClick(canvasRef, e, draw)}
        onTouchEnd={(e) => handleCanvasClick(canvasRef, e, draw)}
        onMouseMove={(e) => handleCanvasDrag(canvasRef, e, draw, mouseStatus)}
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
