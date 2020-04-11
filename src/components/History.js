import React from 'react'
import { useGlobalState, useGlobalDispatch } from '../store/context'
import css from './History.module.css'

const Undo = () => {
  const dispatch = useGlobalDispatch()
  const { painting, history } = useGlobalState()

  const handleUndo = () => {
    if (history.length <= 1) return null

    const updatedHistory = history.slice(0, -1)

    dispatch({
      type: 'POP_HISTORY',
      payload: {
        history: updatedHistory,
        painting: updatedHistory.slice(-1)[0]
      }
    })
  }

  const handleClear = () => {
    let grid = []
    const width = painting.width
    const height = painting.height

    for (let i = height; i > 0; i--) {
      grid.push(new Array(width).fill('◽️'))
    }

    dispatch({
      type: 'UPDATE_PAINTING',
      payload: {
        ...painting,
        grid,
      }
    })
  }

  return (
    <div className={css.tool}>
      <button
        onClick={handleUndo}
        className={css.button}
      >
        <span className={css.buttonLayout}>
          <span className={css.icon} role="img" aria-label="Undo">
            🤭
          </span>
          <span className={css.title}>
            Undo
          </span>
        </span>
      </button>
      <button
        onClick={handleClear}
        className={css.button}
      >
        <span className={css.buttonLayout}>
          <span className={css.icon} role="img" aria-label="Clear">
            🧨
          </span>
          <span className={css.title}>
            Clear
          </span>
        </span>
      </button>
    </div>
  )
}

export default Undo
