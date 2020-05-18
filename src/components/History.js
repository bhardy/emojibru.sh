import React from 'react'
import {
  useRecoilState,
  useSetRecoilState,
  useTransactionObservation_UNSTABLE
} from 'recoil'
import { paintingState, historyState } from '../store/store'
import css from './History.module.css'

const Undo = () => {
  const setPainting = useSetRecoilState(paintingState)
  const [oldHistory, setHistory] = useRecoilState(historyState)

  const handleUndo = () => {
    if (!oldHistory || oldHistory.length <= 1) return null

    const updatedHistory = oldHistory.slice(0, -1)

    setHistory(updatedHistory)
    setPainting(updatedHistory.slice(-1)[0])
  }

  const handleClear = () => {
    // @note: there's actually a bug here where you can't 'undo' to the last state before clearing
    setPainting((oldPainting => {
      let grid = []
      const width = oldPainting.width
      const height = oldPainting.height

      for (let i = height; i > 0; i--) {
        grid.push(new Array(width).fill('◽️'))
      }

      return {
        ...oldPainting,
        grid
      }
    }))
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

const History = () => {
  useTransactionObservation_UNSTABLE(({
    atomValues,
    modifiedAtoms,
  }) => {
    for (const modifiedAtom of modifiedAtoms) {
      localStorage.setItem(modifiedAtom, JSON.stringify({ value: atomValues.get(modifiedAtom) }))
    }
  })
  return (<Undo />)
}

export default History
