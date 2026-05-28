import React, { useEffect, useRef } from 'react'
import cx from 'classnames'
import useKey from 'react-use/lib/useKey'
import useStore from '../store/store'
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

const TEXT_INPUT_TYPES = new Set([
  'text',
  'search',
  'email',
  'url',
  'tel',
  'password',
  'number',
])

const isTextInputFocused = () => {
  const el = typeof document !== 'undefined' ? document.activeElement : null
  if (!el) return false
  if ((el as HTMLElement).isContentEditable) return true
  const tag = el.tagName.toLowerCase()
  if (tag === 'textarea') return true
  if (tag === 'input') {
    // Only text-like input types swallow space. The tool radios get focus
    // when clicked; without this filter every tool-switch would disable
    // spacebar-hold-to-pan until the user clicked elsewhere.
    const type = ((el as HTMLInputElement).type || '').toLowerCase()
    return TEXT_INPUT_TYPES.has(type)
  }
  return false
}

const Tools = ({ tool, updateTool }: ToolsProps) => {
  useKey('d', () => updateTool({ type: 'draw' }), {}, [tool])
  useKey('f', () => updateTool({ type: 'fill' }), {}, [tool])
  useKey('e', () => updateTool({ type: 'erase' }), {}, [tool])

  // Hold spacebar to enter pan mode; release to restore the previous tool.
  // Direct window listeners (vs react-use's useKey) so we have control over
  // preventDefault — without it, spacebar scrolls the page. Also avoids
  // useKey's memoised handler closing over a stale `updateTool` reference if
  // the parent ever swaps it. Tool state is read live via useStore.getState()
  // so we save the actual current tool, not a stale closure.
  const spacePrevToolRef = useRef<ToolType['type'] | null>(null)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== ' ') return
      if (e.repeat) return
      if (isTextInputFocused()) return
      if (spacePrevToolRef.current !== null) return
      const current = useStore.getState().tool
      if (current.type === 'pan') return
      e.preventDefault()
      spacePrevToolRef.current = current.type
      updateTool({ type: 'pan' })
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key !== ' ') return
      if (spacePrevToolRef.current === null) return
      e.preventDefault()
      const restore = spacePrevToolRef.current
      spacePrevToolRef.current = null
      updateTool({ type: restore })
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [updateTool])

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
