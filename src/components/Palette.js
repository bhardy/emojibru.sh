import React, { useCallback, useEffect, useRef, useState, Fragment } from 'react'
import useStore from "../store/store";
import PropTypes from 'prop-types'
import cx from 'classnames'
import useKey from 'react-use/lib/useKey'
import EmojiPicker from './EmojiPicker'
import css from './Palette.module.css'

const Palette = ({ updateTool }) => {
  const paletteNode = useRef()
  const pickerNode = useRef()
  const editButtonNode = useRef()
  const pickerButtonNode = useRef()

  const shortcutsEnabled = useStore((state) => state.allowShortcuts)
  const setShortcutsEnabled = useStore((state) => state.setAllowShortcuts)
  const palette = useStore((state) => state.palette)
  const setPalette = useStore((state) => state.setPalette)
  const tool = useStore((state) => state.tool)

  const [showPicker, setShowPicker] = useState(false)
  const [editPalette, setEditPalette] = useState(false)

  const handleShowPicker = useCallback(() => {
    setShowPicker(true)
    setShortcutsEnabled(false)
  }, [setShortcutsEnabled])

  const handleHidePicker = useCallback(() => {
    setShowPicker(false)
    setEditPalette(false)
    setShortcutsEnabled(true)
  }, [setShortcutsEnabled])

  const handleEditPalette = () => {
    handleShowPicker()
    setEditPalette(true)
  }

  const handleClickOutside = useCallback((e) => {
    if (pickerNode.current.contains(e.target)) return
    if (pickerButtonNode.current.contains(e.target)) return

    if (editPalette) {
      if (paletteNode.current.contains(e.target)) return
      if (editButtonNode.current.contains(e.target)) return
    }
    handleHidePicker()
  }, [editPalette, handleHidePicker])

  useEffect(() => {
    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [showPicker, handleClickOutside])

  useKey('s', () => shortcutsEnabled && handleShowPicker(), {}, [shortcutsEnabled])
  useKey('p', () => shortcutsEnabled && handleEditPalette(), {}, [shortcutsEnabled])
  useKey('Escape', () => handleHidePicker())

  const updatePalette = (index) => {
    setPalette(index, tool.paint)
  }

  const handlePaletteClick = (index) => {
    if (editPalette) {
      updatePalette(index)
    } else {
      updateTool({ paint: palette[index] })
    }
  }

  const handleEditClick = () => {
    if (editPalette) {
      return handleHidePicker()
    }
    handleEditPalette()
  }

  const handlePaletteButton = () => {
    if (!showPicker) {
      return handleShowPicker()
    }
    handleHidePicker()
  }

  return (
    <Fragment>
      <button
        ref={editButtonNode}
        className={cx("button", {
          [css.editButton]: editPalette,
          'topLayer': editPalette
        })}
        onClick={() => handleEditClick()}
      >
        {editPalette ? 'Save' : 'Edit'}
      </button>
      <ul
        ref={paletteNode}
        className={cx(css.palette, {
          [css.edit]: editPalette,
          'topLayer': editPalette
        })}
      >
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
        ref={pickerButtonNode}
        className={cx("button", {
          [css.showPicker]: showPicker && !editPalette,
          'topLayer': showPicker && !editPalette
        })}
        onClick={() => handlePaletteButton()}
      >
        {showPicker ? 'Hide' : 'Show'} EmojiPicker
      </button>
      <div ref={pickerNode} className={css.picker}>
        {showPicker &&
          <EmojiPicker updateTool={updateTool} edit={editPalette}/>
        }
      </div>
    </Fragment>
  )
}

Palette.propTypes = {
  updateTool: PropTypes.func.isRequired
}

export default Palette
