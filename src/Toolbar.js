import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import Copy from './Copy'
import Resize from './Resize'
import Tool from './Tool'
import Paint from './Paint'
import Palette from './Palette'
import css from './styles/Toolbar.module.css'

const Toolbar = ({
  painting,
  resizeCanvas,
  tool,
  updateTool,
  palette,
  updatePalette
}) => {
  return (
    <Fragment>
      <div className={cx(css.toolbar, css.primary)}>
        <h2 className={css.heading}>Size</h2>
        <Resize
          width={painting.width}
          height={painting.height}
          resize={(width, height) => resizeCanvas(width, height)}
        />
        <h2 className={css.heading}>Tool</h2>
        <Tool tool={tool} updateTool={updateTool} />
        <h2 className={css.heading}>Paint</h2>
        <Paint tool={tool} updateTool={updateTool} />
      </div>
      <div className={cx(css.toolbar, css.secondary)}>
        <h2 className={css.heading}>Palette</h2>
        <Palette
          palette={palette}
          updatePalette={updatePalette}
          updateTool={updateTool}
        />
        <h2 className={css.heading}>Save</h2>
        <Copy painting={painting} />
      </div>
    </Fragment>
  )
}

Toolbar.propTypes = {
  painting: PropTypes.object.isRequired,
  resizeCanvas: PropTypes.func.isRequired,
  tool: PropTypes.object.isRequired,
  updateTool: PropTypes.func.isRequired,
  palette: PropTypes.array.isRequired,
  updatePalette: PropTypes.func.isRequired,
}

export default Toolbar
