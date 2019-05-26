import React, {Component} from 'react'
import PropTypes from 'prop-types'
import './styles/Canvas.css'

class Cell extends Component {
  constructor () {
    super()
    this.state = {
      isMouseDown: false
    }
    this.mousedown = () => this.drawLock(true)
    this.mouseup = () => this.drawLock(false)
  }

  componentDidMount () {
    window.addEventListener('mousedown', this.mousedown)
    window.addEventListener('mouseup', this.mouseup)
  }

  componentWillUnmount () {
    window.removeEventListener('mousedown', this.mousedown)
    window.removeEventListener('mouseup', this.mouseup)
  }

  drawLock (mouseDown) {
    this.setState({
      isMouseDown: mouseDown
    })
  }

  drawCheck (row, col) {
    if (this.state.isMouseDown) {
      this.props.draw(row, col)
    }
  }

  render () {
    const paint = this.props.paint
    const row = this.props.row
    const col = this.props.col
    return (
      <span className="canvas-span"
        onMouseDown={() => this.props.draw(row, col)}
        onMouseOver={() => this.drawCheck(row, col)}
      >
        {paint}
      </span>
    )
  }
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
