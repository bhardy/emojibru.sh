/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react'
import PropTypes from 'prop-types'
import css from './styles/Resize.module.css'

const Resizer = ({
  title,
  value,
  increase,
  decrease
}) => {
  return (
    <div className={css.label}>
      <span className={css.title}>{title}</span>
      <span className={css.value}>{value}</span>
      <nav className={css.controls}>
        <button
          className={css.button}
          onClick={increase}
        >
          +
        </button>
        <button
          className={css.button}
          onClick={decrease}
        >
          -
        </button>
      </nav>
    </div>
  )
}

const Resize = ({
  width,
  height,
  resize
}) => (
  <div className={css.resize}>
    <Resizer
      title="Width"
      value={width}
      increase={() => resize(width + 1, height)}
      decrease={() => resize(width - 1, height)}
    />
    <Resizer
      title="Height"
      value={height}
      increase={() => resize(width, height + 1)}
      decrease={() => resize(width, height - 1)}
    />
  </div>
)

Resize.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  resize: PropTypes.func.isRequired
}

export default Resize
