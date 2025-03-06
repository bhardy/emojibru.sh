import React, { Fragment, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import useKey from 'react-use/lib/useKey'
import useStore from "../store/store";
import EmojiPicker from './EmojiPicker'
import css from './Paint.module.css'

const Paint = ({ tool, updateTool }) => {
  const pickerNode = useRef()
  const pickerButtonNode = useRef()
  const paintButtons = useRef()
  
  const showPicker = useStore((state) => state.showPicker)
  const setShowPicker = useStore((state) => state.setShowPicker)

  const handleSwap = () => {
    updateTool({
      paint: tool.alternatePaint,
      alternatePaint: tool.paint
    })
  }

  const handleClickOutside = useCallback((e) => {
    if (paintButtons.current.contains(e.target)) return
    if (pickerButtonNode.current.contains(e.target)) return

    setShowPicker(false)
  }, [setShowPicker])

  
  useKey('s', () => setShowPicker(true), {}, [])
  useKey('x', handleSwap, {}, [tool])
  useKey('Escape', () => {
    if (showPicker) {
      setShowPicker(false)
    }
  }, {}, [showPicker])

  return (
    <Fragment>
      <div className={css.paint} ref={paintButtons}>
        <div className={cx(css.swatch, css.active)}>{tool.paint}</div>
        <div
          className={cx(css.swatch, css.alternate)}
          onClick={() => handleSwap()}
          role="button"
        >
          {tool.alternatePaint}
        </div>
      </div>
      <button
        type="button"
        ref={pickerButtonNode}
        className={cx("button", {
          [css.showPicker]: showPicker,
          'topLayer': showPicker
        })}
        onClick={() => setShowPicker(!showPicker)}
      >
        {showPicker ? 'Hide' : 'Show'} EmojiPicker
      </button>
      <div ref={pickerNode} className={css.picker}>
        {showPicker &&
          <EmojiPicker handleEmojiSelect={updateTool} handleClickOutside={handleClickOutside} />
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
