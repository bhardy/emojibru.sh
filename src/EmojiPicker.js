import React from 'react'
import PropTypes from 'prop-types'
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

const EmojiPicker = ({ updateTool }) => {
  return (
    <div className="picker">
      <Picker
        native={true}
        title='Pick your paint…'
        emoji='point_up_2'
        onSelect={(emoji) => updateTool({ paint: emoji.native })}
      />
    </div>
  )
}

EmojiPicker.propTypes = {
  updateTool: PropTypes.func.isRequired
}

export default EmojiPicker
