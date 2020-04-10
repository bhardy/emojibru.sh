import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useMouseStatus } from '../hooks/useMouseStatus'
import css from './Canvas.module.css'

const Cell = ({ paint, row, col, draw }) => {
  const mouseStatus = useMouseStatus()

  const drawCheck = (row, col) => {
    if (mouseStatus === 'mousedown') {
      draw(row, col)
    }
  }

  const handleClick = event => {
    // @note: this stops annoying bugs on touch devices but isn't perfect or thorougly tested
    event.preventDefault()
    event.stopPropagation()
    draw(row, col)
  }

  return (
    <span
      className={css.cell}
      onMouseDown={() => draw(row, col)}
      onMouseOver={() => drawCheck(row, col)}
      onTouchEnd={(event) => handleClick(event)}
    >
      {paint}
    </span>
  )
}

Cell.propTypes = {
  paint: PropTypes.string.isRequired,
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  draw: PropTypes.func.isRequired
}

const Row = ({ row, rowIndex, draw }) => (
  <div className={css.row}>
    {row.map((cell, colIndex) => (
      <Cell
        row={rowIndex}
        col={colIndex}
        paint={cell}
        draw={draw}
        key={`${rowIndex}${colIndex}`}
      />
    ))}
  </div>
)

Row.propTypes = {
  row: PropTypes.array.isRequired,
  rowIndex: PropTypes.number.isRequired,
  draw: PropTypes.func.isRequired
}

const drawing = (canvasRef, width, height, grid) => {
  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')  
  ctx.font = "26px sans-serif"

  // multiplier -- cell size
  const mp = 32.5;

  // centres
  const cx = canvas.width / 2
  const cy = canvas.height / 2

  // canvas size -- by cells
  const cw = width * mp
  const ch = height * mp

  // offests
  const ox = cx - cw / 2
  const oy = cy - ch / 2

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save()
  ctx.translate(ox,oy)

  // multiplier -- cell size
  grid.forEach((row, yi) => {
    row.forEach((cell, xi) => {
      ctx.fillText(cell, xi * mp, yi * mp)
    })
  })

  // restores the translation to 0,0
  ctx.restore()
}

const Canvas = ({ grid, draw, width, height }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    drawing(canvasRef, width, height, grid)
  }, [width, height, grid])

  function handleCanvasClick(e) {
    console.log(e.clientX, e.clientY);
    // const newLocation = { x: e.clientX, y: e.clientY }
    // setLocations([...locations, newLocation])
  }
  
  function handleClear() {
    // setLocations([])
  }

  function handleUndo() {
    // setLocations(locations.slice(0, -1))
  }

  return (
    <>
      {/* <div className={css.canvas}>
        {grid.map((row, rowIndex) => (
          <Row row={row} rowIndex={rowIndex} draw={draw} key={rowIndex} />
          ))}
      </div> */}
      <div className={css.controls}>
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleUndo}>Undo</button>
      </div>
      <canvas
        className={css.realCanvas}
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={handleCanvasClick}
      />
    </>
  )
}

Canvas.propTypes = {
  grid: PropTypes.array.isRequired,
  draw: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
}

export default Canvas
