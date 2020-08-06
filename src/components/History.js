import React, { useState } from 'react'
import {
  useResetRecoilState,
  useRecoilCallback,
  useTransactionObservation_UNSTABLE,
  useRecoilTransactionObserver_UNSTABLE,
  useGotoRecoilSnapshot
} from 'recoil'
import { isEqual } from 'lodash'
import { paintingState } from '../store/store'
import css from './History.module.css'

function DebugObserver() {
  useRecoilTransactionObserver_UNSTABLE(({snapshot}) => {
    console.log(snapshot.getLoadable(paintingState).contents);
    window.myDebugState = {
      paintingState: snapshot.getLoadable(paintingState).contents,
    };
  });
  return null;
}

const Undo = () => {
  // const [paintingSnapshots, setPaintingSnapshots] = useState([])
  // const lastPaintingSnapshot = paintingSnapshots[paintingSnapshots.length - 2]

  // useRecoilTransactionObserver_UNSTABLE(({snapshot}) => {
  //   const snapshotPainting = snapshot.getLoadable(paintingState).contents
  //   if (!isEqual(lastPaintingSnapshot, snapshotPainting)) {
  //     setPaintingSnapshots([...paintingSnapshots, snapshotPainting])
  //   }
  // })

  const [snapshots, setSnapshots] = useState([])
  
  useRecoilTransactionObserver_UNSTABLE(({snapshot}) => {
    const currentSnapshot = snapshots[snapshots.length - 1]
    const currentSnapshotPainting = currentSnapshot ? currentSnapshot.getLoadable(paintingState).contents : undefined
    const snapshotPainting = snapshot.getLoadable(paintingState).contents
    if (!isEqual(currentSnapshotPainting, snapshotPainting)) {
      setSnapshots([...snapshots, snapshot])
    }
  });

  const handleUndo = useGotoRecoilSnapshot()
  const handleClear = useResetRecoilState(paintingState)

  const lastSnapshot = snapshots[snapshots.length - 2]

  return (
    <div className={css.tool}>
      {/* <ol>
        {snapshots.map((snapshot, i) => (
          <li key={i}>
            Snapshot {i}
            <button onClick={() => handleUndo(snapshot)}>
              Restore
            </button>
          </li>
        ))}
      </ol> */}
      <button
        onClick={() => handleUndo(lastSnapshot)}
        className={css.button}
        disabled={!lastSnapshot}
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
      {/* <DebugObserver/> */}
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

export default Undo
