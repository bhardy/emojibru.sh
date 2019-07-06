import React from 'react'
import PropTypes from 'prop-types'
import { useMouseStatus } from './hooks/useMouseStatus'
import css from './styles/Canvas.module.css'

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
      onMouseUp={(event) => handleClick(event)}
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

const Canvas = ({ grid, draw }) => (
  <div className={css.canvas}>
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
