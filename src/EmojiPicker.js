import React from 'react'
import PropTypes from 'prop-types'
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import css from './styles/EmojiPicker.module.css'

const pickerStyles = {
  outline: '1px solid var(--color3)',
  borderColor: 'var(--color3)',
  borderRadius: 0,
  boxShadow: '5px 5px 0 0 var(--color1)'
}

const EmojiPicker = ({ updateTool }) => {
  return (
    <div className={css.picker}>
      <Picker
        native={true}
        title="Pick your paint…"
        emoji="point_up_2"
        onSelect={(emoji) => updateTool({ paint: emoji.native })}
        color="var(--color2)"
        style={pickerStyles}
      />
    </div>
  )
}

EmojiPicker.propTypes = {
  updateTool: PropTypes.func.isRequired
}

export default EmojiPicker
