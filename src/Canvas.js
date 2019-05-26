import React from 'react'
import PropTypes from 'prop-types'
import { useMouseStatus } from './hooks/useMouseStatus'
import './styles/Canvas.css'

const Cell = ({ paint, row, col, draw }) => {
  const isMouseDown = useMouseStatus()

  const drawCheck = (row, col) => {
    if (isMouseDown === 'mousedown') {
      draw(row, col)
    }
  }

  return (
    <span className="canvas-span"
      onMouseDown={() => draw(row, col)}
      onMouseOver={() => drawCheck(row, col)}
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
  <div>
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

const Canvas = ({ grid, draw }) => (
  <div className="canvas-container">
    {grid.map((row, rowIndex) => (
      <Row row={row} rowIndex={rowIndex} draw={draw} key={rowIndex} />
    ))}
  </div>
)

Canvas.propTypes = {
  grid: PropTypes.array.isRequired,
  draw: PropTypes.func.isRequired
}

export default Canvas
