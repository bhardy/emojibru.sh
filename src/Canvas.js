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
    const fill = this.props.fill
    const row = this.props.row
    const col = this.props.col
    return (
      <span className="canvas-span"
        onMouseDown={() => this.props.draw(row, col)}
        onMouseOver={() => this.drawCheck(row, col)}
      >
        {fill}
      </span>
    )
  }
}

Cell.propTypes = {
  fill: PropTypes.string.isRequired,
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  draw: PropTypes.func.isRequired
}

class Row extends Component {
  render () {
    const row = this.props.row
    const rowIndex = this.props.rowIndex
    const draw = this.props.draw

    let cols = row.map(function (cell, colIndex) {
      return (
        <Cell
          row={rowIndex}
          col={colIndex}
          fill={cell}
          draw={draw}
          key={`${rowIndex}${colIndex}`}
        />
      )
    })
    return <div>{cols}</div>
  }
}

Row.propTypes = {
  row: PropTypes.array.isRequired,
  rowIndex: PropTypes.number.isRequired,
  draw: PropTypes.func.isRequired
}

export default class Canvas extends Component {
  render () {
    const grid = this.props.grid
    const draw = this.props.draw
    let rows = grid.map(function (row, rowIndex) {
      return <Row row={row} rowIndex={rowIndex} draw={draw} key={rowIndex} />
    })

    return (
      <div className="canvas-container">{rows}</div>
    )
  }
}

Canvas.propTypes = {
  grid: PropTypes.array.isRequired,
  draw: PropTypes.func.isRequired
}
