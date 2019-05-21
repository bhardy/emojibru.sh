import React, {Component} from 'react'
import PropTypes from 'prop-types'
import './styles/Resize.css'

export default class Resize extends Component {
  render () {
    let width = this.props.width
    let height = this.props.height

    return (
      <div>
        <label>
          Height: {this.props.height}
          <button
            className="button"
            onClick={() => this.props.resize(width, height + 1)}
          >
            ➕
          </button>
          <button
            className="button"
            onClick={() => this.props.resize(width, height - 1)}
          >
            ➖
          </button>
        </label>
        <label>
          Width: {this.props.width}
          <button
            className="button"
            onClick={() => this.props.resize(width + 1, height)}
          >
            ➕
          </button>
          <button
            className="button"
            onClick={() => this.props.resize(width - 1, height)}
          >
            ➖
          </button>
        </label>
      </div>
    )
  }
}

Resize.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  resize: PropTypes.func.isRequired
}
