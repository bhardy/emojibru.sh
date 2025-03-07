import React, { useCallback, useRef } from 'react'
import useStore from "../store/store";
import PropTypes from 'prop-types'
import cx from 'classnames'
import useKey from 'react-use/lib/useKey'
import EmojiPicker from './EmojiPicker'
import css from './Palette.module.css'

const Palette = ({ updateTool }) => {
  const paletteNode = useRef()
  const editButtonNode = useRef()

  const palette = useStore((state) => state.palette)
  const setPalette = useStore((state) => state.setPalette)
  const tool = useStore((state) => state.tool)
  const editPaletteMode = useStore((state) => state.editPaletteMode)
  const setEditPaletteMode = useStore((state) => state.setEditPaletteMode)

  const handleEditPalette = () => {
    setEditPaletteMode(true)
  }

  const handleClickOutside = useCallback((e) => {
    // don't close picker if clicked edit button
    if (editButtonNode.current?.contains(e.target)) return
    
    // @note: this is can't be checked with contains (like above) because the
    // node being clicked on has been updated before this function is called
    // We need to escape special characters in class names for CSS selectors
    const hasMatchingChild = Array.from(e.target.classList).some(className => {
      try {
        const escapedClassName = CSS.escape(className);
        return paletteNode.current?.querySelector(`.${escapedClassName}`) !== null;
      } catch (err) {
        return false;
      }
    });
    
    // don't close the picker if we clicked on a palette swatch
    if (hasMatchingChild) return
    
    setEditPaletteMode(false)
  }, [setEditPaletteMode])

  // @todo: check if we need the shortcut checks
  useKey('p', () => handleEditPalette(), {}, [])
  useKey('Escape', () => {
    if (editPaletteMode) {
      setEditPaletteMode(false)
    }
  }, {}, [editPaletteMode])

  const updatePalette = (index) => {
    setPalette(index, tool.paint)
  }

  const handlePaletteClick = (index) => {
    if (editPaletteMode) {
      updatePalette(index)
    } else {
      updateTool({ paint: palette[index] })
    }
  }

  const handleEditClick = () => {
    if (editPaletteMode) {
      return setEditPaletteMode(false)
    }
    handleEditPalette()
  }

  return (
    <>
      <ul
        ref={paletteNode}
        className={cx(css.palette, {
          [css.edit]: editPaletteMode,
          'topLayer': editPaletteMode
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
        type="button"
        ref={editButtonNode}
        className={cx("button", {
          [css.editButton]: editPaletteMode,
          'topLayer': editPaletteMode
        })}
        onClick={() => handleEditClick()}
      >
        {editPaletteMode ? 'Save Palette' : 'Edit Palette'}
      </button>
      {editPaletteMode && (
        <div className={css.picker}>
          <EmojiPicker handleEmojiSelect={updateTool} handleClickOutside={handleClickOutside} edit/>
        </div>
      )}
    </>
  )
}

Palette.propTypes = {
  updateTool: PropTypes.func.isRequired
}

export default Palette
