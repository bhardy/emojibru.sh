import React from 'react'
import cx from 'classnames'
import useKey from 'react-use/lib/useKey'
import { Tool as ToolType } from '@/types'
import css from './Tool.module.css'

interface BrushProps {
  currentTool: ToolType
  type: ToolType['type']
  updateTool: (update: Partial<ToolType>) => void
  icon: string
}

const Brush = ({
  currentTool,
  type,
  updateTool,
  icon
}: BrushProps) => {
  const active = currentTool.type === type
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

interface ToolProps {
  tool: ToolType
  updateTool: (update: Partial<ToolType>) => void
}

const Tool = ({ tool, updateTool }: ToolProps) => {
  useKey('d', () => updateTool({ type: 'draw' }), {}, [tool])
  useKey('f', () => updateTool({ type: 'fill' }), {}, [tool])
  useKey('e', () => updateTool({ type: 'erase' }), {}, [tool])
  
  return (
    <div className={css.tool}>
      <span className="visually-hidden" aria-label={`Current Tool: ${tool.type}`}>
        Current Tool: {tool.type}
      </span>
      <Brush
        currentTool={tool}
        type="draw"
        updateTool={updateTool}
        icon="🖌"
      />
      <Brush
        currentTool={tool}
        type="fill"
        updateTool={updateTool}
        icon="🌀"
      />
      <Brush
        currentTool={tool}
        type="erase"
        updateTool={updateTool}
        icon="💨"
      />
    </div>
  )
}

export default Tool
