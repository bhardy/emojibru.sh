import React, { useRef, useCallback } from 'react'
import cx from 'classnames'
import useKey from 'react-use/lib/useKey'
import useStore from "../store/store";
import EmojiPicker from './EmojiPicker'
import ColorPicker from './ColorPicker'
import { Tool } from '@/types'
import css from './Paint.module.css'

interface PaintProps {
  tool: Tool
  updateTool: (update: Partial<Tool>) => void
}

const Paint = ({ tool, updateTool }: PaintProps) => {
  const pickerNode = useRef<HTMLDivElement>(null)
  const pickerButtonNode = useRef<HTMLButtonElement>(null)
  const paintButtons = useRef<HTMLDivElement>(null)
  
  const showPicker = useStore((state) => state.showPicker)
  const setShowPicker = useStore((state) => state.setShowPicker)

  const handleClickOutside = useCallback((e: MouseEvent) => {
    // don't close picker if clicked edit button
    if (paintButtons.current && pickerButtonNode.current) {
      if (paintButtons.current.contains(e.target as Node)) return
      if (pickerButtonNode.current.contains(e.target as Node)) return
    }
    
    setShowPicker(false)
  }, [setShowPicker])

  useKey('s', () => setShowPicker(true), {}, [])
  useKey('Escape', () => {
    if (showPicker) {
      setShowPicker(false)
    }
  }, {}, [showPicker])

  return (
    <>
      <div className={css.paint}>
        <ColorPicker tool={tool} updateTool={updateTool} ref={paintButtons} />
      </div>
      <button
        type="button"
        ref={pickerButtonNode}
        className={cx("button", css.button, {
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
    </>
  )
}

export default Paint
