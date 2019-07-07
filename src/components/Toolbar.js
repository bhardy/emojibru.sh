import React, { Fragment } from 'react'
import cx from 'classnames'
import { useGlobalState, useGlobalDispatch } from '../store/context'
import Copy from './Copy'
import Resize from './Resize'
import Tool from './Tool'
import Paint from './Paint'
import Palette from './Palette'
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
        <h2 className={css.heading}>Size</h2>
        <Resize />
        <h2 className={css.heading}>Tool</h2>
        <Tool tool={tool} updateTool={updateTool} />
        <h2 className={css.heading}>Paint</h2>
        <Paint tool={tool} updateTool={updateTool} />
      </aside>
      <aside className={cx(css.toolbar, css.secondary)}>
        <h2 className={css.heading}>Palette</h2>
        <Palette updateTool={updateTool} />
        <h2 className={css.heading}>Save</h2>
        <Copy />
      </aside>
    </Fragment>
  )
}

export default Toolbar
