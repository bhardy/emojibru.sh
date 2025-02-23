import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import useKey from 'react-use/lib/useKey'
import useStore from "../store/store";
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
  const shortcutsEnabled = useStore((state) => state.allowShortcuts)
  useKey('d', () => shortcutsEnabled && updateTool({ type: 'draw' }), {}, [tool, shortcutsEnabled])
  useKey('f', () => shortcutsEnabled && updateTool({ type: 'fill' }), {}, [tool, shortcutsEnabled])
  useKey('e', () => shortcutsEnabled && updateTool({ type: 'erase' }), {}, [tool, shortcutsEnabled])
  return (
    <div className={css.tool}>
      <span className="visually-hidden">Current Tool: {tool.type}</span>
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
