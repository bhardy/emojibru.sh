import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import useKey from 'react-use/lib/useKey'
import css from './Paint.module.css'

const Paint = ({ tool, updateTool }) => {
  const handleSwap = () => {
    updateTool({
      paint: tool.alternatePaint,
      alternatePaint: tool.paint
    })
  }

  useKey('x', handleSwap, {}, [tool])
  return (
    <div>
      <div className={css.paint}>
        <div className={cx(css.swatch, css.active)}>{tool.paint}</div>
        <div
          className={cx(css.swatch, css.alternate)}
          onClick={() => handleSwap()}
          role="button"
        >
          {tool.alternatePaint}
        </div>
      </div>
    </div>
  )
}

Paint.propTypes = {
  tool: PropTypes.object.isRequired,
  updateTool: PropTypes.func.isRequired
}

export default Paint
