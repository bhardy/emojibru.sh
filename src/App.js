import React, { Component } from 'react'
import Artboard from './Artboard'
import './styles/App.css';

class App extends Component {
  state = {
    title: '',
    painting: {
      grid: [],
      width: 10,
      height: 8,
      text: ''
    },
  }

  render() {
    return (
      <div className="App">
        <Artboard
          painting={this.state.painting}
          updatePainting={this.updatePainting}
        />
      </div>
    )
  }

  updatePainting = (painting) => {
    this.setState({
      painting: {
        ...this.state.painting,
        ...painting
      },
    })
  }

  _convertPaintingToText = (grid) => {
    return grid.map(row => {
      return row.join('') + '\n'
    }).join('')
  }
}

export default App
