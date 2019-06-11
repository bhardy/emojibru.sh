import React, { useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import useKey from 'react-use/lib/useKey'
import EmojiPicker from './EmojiPicker'
import css from './styles/Palette.module.css'

const Palette = ({ palette, updatePalette, updateTool }) => {
  const [showPicker, setShowPicker] = useState(false)
  const [editPalette, setEditPalette] = useState(false)

  useKey('s', () => setShowPicker(!showPicker))
  useKey('Escape', () => setShowPicker(false))

  const handlePaletteClick = (index) => {
    if (editPalette) {
      updatePalette(index)
    } else {
      updateTool({ paint: palette[index] })
    }
  }

  const handleEditClick = () => {
    if (!showPicker && !editPalette) {
      setShowPicker(true)
    }
    setEditPalette(!editPalette)
  }

  return (
    <Fragment>
      <button className="button" onClick={() => handleEditClick()}>
        {editPalette ? 'Save' : 'Edit'}
      </button>
      <ul className={cx(css.palette, {
        [css.edit]: editPalette
      })}>
        {palette.map((fill, index) => (
          <li
            onClick={() => handlePaletteClick(index)}
            key={`key-${fill}-${index}`}
            className={css.swatch}
          >
            {fill}
          </li>
        ))}
      </ul>
      <button
        className={cx("button", {
          [css.showPicker]: showPicker
        })}
        onClick={() => setShowPicker(!showPicker)}
      >
        {showPicker ? 'Hide' : 'Show'} EmojiPicker
      </button>
      <div className={css.picker}>
        {showPicker &&
          <EmojiPicker updateTool={updateTool} />
        }
      </div>
    </Fragment>
  )
}

Palette.propTypes = {
  palette: PropTypes.array.isRequired,
  updatePalette: PropTypes.func.isRequired,
  updateTool: PropTypes.func.isRequired
}

export default Palette
