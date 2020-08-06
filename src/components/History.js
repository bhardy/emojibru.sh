import React from 'react'
import {
  useRecoilState,
  useSetRecoilState,
  useTransactionObservation_UNSTABLE,
  useResetRecoilState
} from 'recoil'
import { paintingState, historyState } from '../store/store'
import css from './History.module.css'

const Undo = () => {
  const setPainting = useSetRecoilState(paintingState)
  const [history, setHistory] = useRecoilState(historyState)

  const handleUndo = () => {
    if (!history || history.length <= 1) return null

    const updatedHistory = history.slice(0, -1)

    setHistory(updatedHistory)
    setPainting(updatedHistory.slice(-1)[0])
  }

  const handleClear = useResetRecoilState(paintingState)
  const disableUndo = (history && history.length < 2);

  return (
    <div className={css.tool}>
      <button
        onClick={handleUndo}
        className={css.button}
        disabled={disableUndo}
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
