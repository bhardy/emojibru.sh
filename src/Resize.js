/* eslint-disable jsx-a11y/accessible-emoji */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import css from './styles/Resize.module.css'

export default class Resize extends Component {
  render () {
    let width = this.props.width
    let height = this.props.height

    return (
      <div className={css.resize}>
        <label className={css.label}>
          <span className={css.width}> Width: </span>
          <span className={css.widthAmount}>{this.props.width}</span>
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
      </div>
    )
  }
}

Resize.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  resize: PropTypes.func.isRequired
}
