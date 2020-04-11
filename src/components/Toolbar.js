import React, { Fragment } from 'react'
import cx from 'classnames'
import { useGlobalState, useGlobalDispatch } from '../store/context'
import Resize from './Resize'
import Tool from './Tool'
import History from './History'
import Paint from './Paint'
import Palette from './Palette'
import Share from './Share'
import css from './Toolbar.module.css'

const Toolbar = () => {
  const { tool } = useGlobalState()
  const dispatch = useGlobalDispatch()

  const updateTool = (update) => {
    dispatch({
      type: 'UPDATE_TOOL',
      payload: {
        ...tool,
        ...update
      }
    })
  }

  return (
    <Fragment>
      <aside className={cx(css.toolbar, css.primary)}>
        <h2 className={css.heading}>Tool</h2>
        <Tool tool={tool} updateTool={updateTool} />
        <h2 className={css.heading}>Paint</h2>
        <Paint tool={tool} updateTool={updateTool} />
        <h2 className={css.heading}>Size</h2>
        <Resize />
        <h2 className={css.heading}>History</h2>
        <History />
      </aside>
      <aside className={cx(css.toolbar, css.secondary)}>
        <h2 className={css.heading}>Palette</h2>
        <Palette updateTool={updateTool} />
        <h2 className={css.heading}>Share</h2>
        <Share />
      </aside>
    </Fragment>
  )
}

export default Toolbar
