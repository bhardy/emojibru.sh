import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import css from './EmojiPicker.module.css'

const EmojiPicker = ({ updateTool, edit }) => {
  const color = edit ? 'var(--color3)' : 'var(--color2)'

  // @note: Picker doesn't accept a class
  const picker = {
    outline: `1px solid ${color}`,
    borderColor: color,
    borderRadius: 0,
    boxShadow: `6px 6px 0 0 var(--color1), 6px 6px 100px 25px ${edit ? 'var(--color4)' : 'var(--color3)'}`
  }

  return (
    <div
      className={cx(css.container, {
        [css.edit]: edit,
      })}
    >
      <Picker
        native={true}
        title="Pick your paint…"
        emoji="point_up_2"
        onSelect={(emoji) => updateTool({ paint: emoji.native })}
        color={color}
        style={picker}
      />
    </div>
  )
}

EmojiPicker.propTypes = {
  updateTool: PropTypes.func.isRequired,
  edit: PropTypes.bool
}

EmojiPicker.defaultProps = {
  edit: false
}

export default EmojiPicker
