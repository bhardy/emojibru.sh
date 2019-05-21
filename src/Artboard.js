import React, {Component} from 'react'
import {cloneDeep} from 'lodash'
import Canvas from './Canvas.js'
import Resize from './Resize.js'
// import Copy from './Copy.js'
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import './styles/Artboard.css'

export default class Artboard extends Component {
  constructor () {
    super()
    this.state = {
      brush: '😊'
    }
  }

  componentDidMount () {
    const { painting, updatePainting } = this.props;
    let grid = new Array(painting.height)
    for (let i = 0; i < painting.height; i++) {
      grid[i] = new Array(painting.width).fill('◽️')
    }
    updatePainting({ grid });
  }

  updateBrush (emoji) {
    this.setState({
      brush: emoji.native
    })
  }

  resizeCanvas (width, height) {
    const { painting, updatePainting } = this.props;

    let grid = cloneDeep(painting.grid)
    const prevWidth = painting.width
    const prevHeight = painting.height
    const widthChange = width - prevWidth
    const heightChange = height - prevHeight

    if (heightChange > 0) {
      for (let i = heightChange; i > 0; i--) {
        grid.push(new Array(width).fill('◽️'))
      }
    } else if (heightChange < 0) {
      grid = grid.slice(0, height)
    }

    if (widthChange !== 0) {
      for (let i = 0; i < grid.length; i++) {
        if (widthChange > 0) {
          for (let x = 0; x < widthChange; x++) {
            grid[i].push('◽️')
          }
        } else {
          grid[i] = grid[i].slice(0, width)
        }
      }
    }

    updatePainting({
      grid,
      width,
      height
    })
  }

  draw (row, col) {
    const { painting, updatePainting } = this.props;
    const grid = cloneDeep(painting.grid)
    const forcedEmojiChar = `${this.state.brush}${String.fromCharCode(65039)}`
    grid[row][col] = forcedEmojiChar
    updatePainting({ grid });
  }

  render () {
    const { painting } = this.props;

    return (
      <div className="artboard">
        <div className="canvas">
          <Canvas
            grid={painting.grid}
            width={painting.width}
            height={painting.height}
            draw={(row, col) => this.draw(row, col)}
          />
        </div>
        <div className="resize">
          <Resize
            width={painting.width}
            height={painting.height}
            resize={(width, height) => this.resizeCanvas(width, height)}
          />
        </div>
        {/* <Copy grid={painting.grid} /> */}
        <div className="picker">
          <Picker
            native={true}
            title='Pick your brush…'
            emoji='point_up_2'
            onSelect={(emoji) => this.updateBrush(emoji)}
          />
        </div>
      </div>
    )
  }
}
