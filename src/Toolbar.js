import React from 'react'
import PropTypes from 'prop-types'
import Copy from './Copy'
import Resize from './Resize'
import Tool from './Tool'
import Paint from './Paint'
import css from './styles/Toolbar.module.css'

const Toolbar = ({ painting, resizeCanvas, tool, updateTool }) => {
  return (
    <div className={css.controls}>
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
      <h2 className={css.heading}>Save</h2>
      <Copy painting={painting} />
    </div>
  )
}

Toolbar.propTypes = {
  painting: PropTypes.object.isRequired,
  resizeCanvas: PropTypes.func.isRequired
}

export default Toolbar
