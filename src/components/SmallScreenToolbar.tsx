import cx from 'classnames'
import useStore from '../store/store'
import { Tool as ToolType } from '@/types'
import ColorPicker from './ColorPicker'
import css from './SmallScreenToolbar.module.css'

interface ToolProps {
  currentTool: ToolType
  type: ToolType['type']
  icon: string
  title: string
  updateTool: (update: Partial<ToolType>) => void
}

const Tool = ({ currentTool, type, icon, title, updateTool }: ToolProps) => {
  const active = currentTool.type === type
  return (
    <button
      className={cx(css.toolButton, { [css.activeTool]: active })}
      type="button"
      aria-label={title}
      onClick={() => updateTool({ type })}
    >
      <div className={css.buttonFlexContainer}>
        <span className={css.icon} role="img" aria-label={type}>
          {icon}
        </span>
        <span className={css.title}>{title}</span>
      </div>
    </button>
  )
}

const SmallScreenToolbar = () => {
  const tool = useStore((state) => state.tool)
  const updateTool = useStore((state) => state.setTool)
  const setShowExpandedToolbar = useStore(
    (state) => state.setShowExpandedToolbar,
  )
  const showExpandedToolbar = useStore((state) => state.showExpandedToolbar)
  return (
    <>
      <nav
        className={css.smallScreenToolbar}
        aria-label="Drawing tools for small screens"
      >
        <ul className={css.tools}>
          <li>
            <Tool
              type="draw"
              icon="🖌️"
              title="Draw"
              currentTool={tool}
              updateTool={updateTool}
            />
          </li>
          <li>
            <Tool
              type="fill"
              icon="🌀"
              title="Fill"
              currentTool={tool}
              updateTool={updateTool}
            />
          </li>
          <li>
            <Tool
              type="erase"
              icon="💨"
              title="Erase"
              currentTool={tool}
              updateTool={updateTool}
            />
          </li>
        </ul>
        <ColorPicker tool={tool} updateTool={updateTool} mini />
        <button
          className={css.menuButton}
          type="button"
          aria-label="Show More"
          onClick={() => setShowExpandedToolbar(true)}
        >
          <div className={css.buttonFlexContainer}>
            <span
              className={css.icon}
              role="img"
              aria-label="Hamburger Menu Icon"
            >
              🍔
            </span>
            <span className={css.title}>Menu</span>
          </div>
        </button>
      </nav>
      {/* @todo: this is a bit gross, move it */}
      {showExpandedToolbar && (
        <button
          className={cx(css.menuButton, css.closeMenuButton)}
          type="button"
          aria-label="Show More"
          onClick={() => setShowExpandedToolbar(false)}
        >
          <div className={css.buttonFlexContainer}>
            <span className={css.icon} role="img" aria-label="Close Menu Icon">
              🙅
            </span>
            <span className={css.title}>Close</span>
          </div>
        </button>
      )}
    </>
  )
}

export default SmallScreenToolbar
