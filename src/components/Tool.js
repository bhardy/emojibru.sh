import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import useKey from 'react-use/lib/useKey'
import css from './Tool.module.css'

const Brush = ({
  tool,
  type,
  updateTool,
  icon
}) => {
  const active = tool.type === type
  return (
    <label className={cx(css.label, {
      [css.activeLabel]: active
    })}>
      <input
        type="radio"
        name={type}
        value={type}
        checked={active}
        onChange={() => updateTool({ type })}
        className={cx(css.radio, 'visually-hidden')}
      />
      <span className={css.icon} role="img" aria-label={type}>
        {icon}
      </span>
      <span className={css.title}>
        {type}
      </span>
    </label>
  )
}

Brush.propTypes = {
  tool: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  updateTool: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
}

const Tool = ({ tool, updateTool }) => {
  useKey('d', () => updateTool({ type: 'draw' }), {}, [tool])
  useKey('f', () => updateTool({ type: 'fill' }), {}, [tool])
  useKey('e', () => updateTool({ type: 'erase' }), {}, [tool])
  
  return (
    <div className={css.tool}>
      <span className="visually-hidden" aria-label={`Current Tool: ${tool.type}`}>
        Current Tool: {tool.type}
      </span>
      <Brush
        tool={tool}
        type="draw"
        updateTool={updateTool}
        icon="🖌"
      />
      <Brush
        tool={tool}
        type="fill"
        updateTool={updateTool}
        icon="🌀"
      />
      <Brush
        tool={tool}
        type="erase"
        updateTool={updateTool}
        icon="💨"
      />
    </div>
  )
}

Tool.propTypes = {
  tool: PropTypes.object.isRequired,
  updateTool: PropTypes.func.isRequired
}

export default Tool
