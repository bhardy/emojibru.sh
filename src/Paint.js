import React, { useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import EmojiPicker from './EmojiPicker'
import css from './styles/Paint.module.css'

const Paint = ({ tool, updateTool }) => {
  const handleSwap = () => {
    updateTool({
      paint: tool.alternatePaint,
      alternatePaint: tool.paint
    })
  }
  const [showPicker, setShowPicker] = useState(false);
  return (
    <Fragment>
      <div>
        <div className={css.paint}>
          <div className={cx(css.swatch, css.active)}>{tool.paint}</div>
          <div
            className={cx(css.swatch, css.alternate)}
            onClick={handleSwap}
            role="button"
          >
            {tool.alternatePaint}
          </div>
        </div>
      </div>
      <button
        className="button"
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

Paint.propTypes = {
  tool: PropTypes.object.isRequired,
  updateTool: PropTypes.func.isRequired
}

export default Paint
