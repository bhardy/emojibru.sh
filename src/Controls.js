import React from 'react'
import PropTypes from 'prop-types'
import Copy from './Copy'
import EmojiPicker from './EmojiPicker'
import Resize from './Resize.js'
import Tool from './Tool.js'
import css from './styles/Controls.module.css'

const Controls = ({ painting, resizeCanvas, tool, updateTool }) => {
  return (
    <div className={css.controls}>
      <Resize
        width={painting.width}
        height={painting.height}
        resize={(width, height) => resizeCanvas(width, height)}
      />
      <Tool tool={tool} updateTool={updateTool} />
      <Copy painting={painting} />
      <EmojiPicker updateTool={updateTool} />
    </div>
  )
}

Controls.propTypes = {
  painting: PropTypes.object.isRequired,
  resizeCanvas: PropTypes.func.isRequired
}

export default Controls
