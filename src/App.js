import React, { Component } from 'react'
import { cloneDeep } from 'lodash'
import Artboard from './Artboard'
import Toolbar from './Toolbar'
import css from './styles/App.module.css';

class App extends Component {
  state = {
    painting: {
      grid: [],
      width: 10,
      height: 8,
    },
    tool: {
      type: 'draw',
      paint: '😊',
      alternatePaint: '😎'
    },
    palette: ["😎","🚵","🌁","⛰️","🌳","🌲","👩‍🎤","💣","🐸","🦍","🐝","💎"]
  }

  updatePainting = (painting) => {
    this.setState({
      painting: {
        ...this.state.painting,
        ...painting
      },
    })
  }

  updateTool = (tool) => {
    this.setState({
      tool: {
        ...this.state.tool,
        ...tool
      }
    })
  }

  updatePalette = (index) => {
    const { palette, tool } = this.state;
    this.setState({
      palette: [
        ...palette.slice(0, index),
        tool.paint,
        ...palette.slice(index + 1)
      ]
    })
  }

  resizeCanvas = (width, height) => {
    const { painting } = this.state;

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

    this.updatePainting({
      grid,
      width,
      height
    })
  }

  saveStateToLocalStorage = () => {
    for (let key in this.state) {
      localStorage.setItem(key, JSON.stringify(this.state[key]))
    }
  }

  hydrateStateWithLocalStorage = () => {
    for (let key in this.state) {
      if (localStorage.hasOwnProperty(key)) {
        let value = localStorage.getItem(key)

        try {
          value = JSON.parse(value)
          this.setState({ [key]: value })
        } catch (e) {
          // handle empty string
          this.setState({ [key]: value })
        }
      }
    }
  }

  componentDidMount() {
    this.hydrateStateWithLocalStorage()
    window.addEventListener('beforeunload', this.saveStateToLocalStorage)
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.saveStateToLocalStorage)
    this.saveStateToLocalStorage()
  }

  render() {
    const { painting, tool, palette } = this.state;
    return (
      <div className={css.app}>
        <h1 className={css.header}>EmojiBrush</h1>
        <Artboard
          painting={painting}
          updatePainting={this.updatePainting}
          tool={tool}
          updateTool={this.updateTool}
        />
        <Toolbar
          painting={painting}
          resizeCanvas={this.resizeCanvas}
          tool={tool}
          updateTool={this.updateTool}
          palette={palette}
          updatePalette={this.updatePalette}
        />
        <div className={css.footer}>
          <p>Made with <span role="img" aria-label="Love">😍</span> by <a href="https://branthardy.com/" target="_blank" rel="noopener noreferrer">Brant Hardy</a>. Copyright &copy; {new Date().getFullYear()}</p>
          <p>Thank you to <a href="https://missiveapp.com/">Missive</a> for developing <a href="https://www.npmjs.com/package/emoji-mart" target="_blank" rel="noopener noreferrer">Emoji Mart</a> which EmojiBrush uses for the Emoji Picker</p>
        </div>
      </div>
    )
  }
}

export default App
