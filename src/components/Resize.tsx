import React from 'react'
import { cloneDeep } from 'lodash'
import useStore from '../store/store'
import css from './Resize.module.css'

const Resizer = ({
  title,
  value,
  increase,
  decrease,
}: {
  title: string
  value: number
  increase: () => void
  decrease: () => void
}) => {
  return (
    <div className={css.label}>
      <span className={css.title}>{title}</span>
      <span className={css.value}>{value}</span>
      <nav className={css.controls}>
        <button type="button" className={css.button} onClick={increase}>
          +
        </button>
        <button type="button" className={css.button} onClick={decrease}>
          -
        </button>
      </nav>
    </div>
  )
}

const Resize = () => {
  const painting = useStore((state) => state.painting)
  const setPainting = useStore((state) => state.setPainting)
  const { width, height } = painting

  const resize = (width: number, height: number) => {
    let grid = cloneDeep(painting.grid)
    const prevWidth = painting.width
    const prevHeight = painting.height
    const widthChange = width - prevWidth
    const heightChange = height - prevHeight

    if (heightChange > 0) {
      for (let i = heightChange; i > 0; i--) {
        grid.push(new Array(width).fill('◽️'))
      }
    } else if (heightChange < 0) {
      grid = grid.slice(0, height)
    }

    if (widthChange !== 0) {
      for (let i = 0; i < grid.length; i++) {
        if (widthChange > 0) {
          for (let x = 0; x < widthChange; x++) {
            grid[i].push('◽️')
          }
        } else {
          grid[i] = grid[i].slice(0, width)
        }
      }
    }

    const newPainting = {
      grid,
      width,
      height,
    }

    setPainting(newPainting)
  }

  return (
    <div className={css.resize}>
      <Resizer
        title="Width"
        value={width}
        increase={() => resize(width + 1, height)}
        decrease={() => resize(width - 1, height)}
      />
      <Resizer
        title="Height"
        value={height}
        increase={() => resize(width, height + 1)}
        decrease={() => resize(width, height - 1)}
      />
    </div>
  )
}

export default Resize
