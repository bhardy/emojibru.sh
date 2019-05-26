import React, { Component } from 'react'
import Artboard from './Artboard'
import './styles/App.css';

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
    }
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
    return (
      <div className="App">
        <Artboard
          painting={this.state.painting}
          updatePainting={this.updatePainting}
          tool={this.state.tool}
          updateTool={this.updateTool}
        />
      </div>
    )
  }
}

export default App
