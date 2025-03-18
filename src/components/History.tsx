import cx from 'classnames'
import useStore from '../store/store'
import css from './History.module.css'

const Clear = () => {
  const handleClear = useStore((state) => state.resetPainting)

  return (
    <div className={css.tool}>
      <button
        type="button"
        onClick={handleClear}
        className={cx(css.button, 'button')}
      >
        <span className={css.buttonLayout}>
          <span className={css.icon} role="img" aria-label="Clear">
            🧨
          </span>
          <span className={css.title}>Clear</span>
        </span>
      </button>
    </div>
  )
}

export default Clear
