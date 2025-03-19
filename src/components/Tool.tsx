import React from 'react'
import cx from 'classnames'
import useKey from 'react-use/lib/useKey'
import { Tool as ToolType } from '@/types'
import css from './Tool.module.css'

interface ToolProps {
  currentTool: ToolType
  type: ToolType['type']
  updateTool: (update: Partial<ToolType>) => void
  icon: string
}

const Tool = ({ currentTool, type, updateTool, icon }: ToolProps) => {
  const active = currentTool.type === type
  return (
    <label
      className={cx(css.label, css[`label-${type}`], {
        [css.activeLabel]: active,
      })}
    >
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
      <span className={css.title}>{type}</span>
    </label>
  )
}

interface ToolsProps {
  tool: ToolType
  updateTool: (update: Partial<ToolType>) => void
}

const Tools = ({ tool, updateTool }: ToolsProps) => {
  useKey('d', () => updateTool({ type: 'draw' }), {}, [tool])
  useKey('f', () => updateTool({ type: 'fill' }), {}, [tool])
  useKey('e', () => updateTool({ type: 'erase' }), {}, [tool])
  // @note: since we hide the pan tool in some cases we need better conditional
  // logic before enabling the shortcut
  // useKey(' ', () => updateTool({ type: 'pan' }), {}, [tool])

  return (
    <div className={css.tool}>
      <span
        className="visually-hidden"
        aria-label={`Current Tool: ${tool.type}`}
      >
        Current Tool: {tool.type}
      </span>
      <Tool currentTool={tool} type="draw" updateTool={updateTool} icon="🖌" />
      <Tool currentTool={tool} type="fill" updateTool={updateTool} icon="🌀" />
      <Tool currentTool={tool} type="erase" updateTool={updateTool} icon="💨" />
      <Tool currentTool={tool} type="pan" updateTool={updateTool} icon="🤚" />
    </div>
  )
}

export default Tools
