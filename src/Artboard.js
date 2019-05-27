import React, {Component} from 'react'
import {cloneDeep} from 'lodash'
import Canvas from './Canvas.js'
import cellsToFill from './utils/fill'
import 'emoji-mart/css/emoji-mart.css'
import css from './styles/Artboard.module.css'

export default class Artboard extends Component {
  componentDidMount () {
    const { painting, updatePainting } = this.props
    let grid = new Array(painting.height)
    for (let i = 0; i < painting.height; i++) {
      grid[i] = new Array(painting.width).fill('◽️')
    }
    updatePainting({ grid })
  }

  paint = (row, col) => {
    const { tool } = this.props;
    switch (tool.type) {
      case 'draw':
        this.draw(row, col);
        break;
      case 'fill':
        this.fill(row, col);
        break;
      default:
        break;
    }
  }

  emojiChar = () => {
    const paint = this.props.tool.paint
    return `${paint}${String.fromCharCode(65039)}`
  }

  draw = (row, col) => {
    const { painting, updatePainting } = this.props
    const grid = cloneDeep(painting.grid)
    grid[row][col] = this.emojiChar()
    updatePainting({ grid })
  }

  fill = (row, col) => {
    const { painting, updatePainting } = this.props
    const grid = cloneDeep(painting.grid)
    cellsToFill(grid, { x: col, y: row }).forEach(({ x, y }) => {
      grid[y][x] = this.emojiChar()
    })
    updatePainting({ grid })
  }

  render () {
    const { painting } = this.props;

    return (
      <div className={css.artboard}>
        <div className="canvas">
          <Canvas
            grid={painting.grid}
            width={painting.width}
            height={painting.height}
            draw={(row, col) => this.paint(row, col)}
          />
        </div>
      </div>
    )
  }
}
