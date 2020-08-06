import React, { useEffect, useCallback } from 'react'
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil'
import { cloneDeep, debounce} from 'lodash'
import { paintingState, historyState, toolState } from '../store/store'
import Canvas from './Canvas'
import cellsToFill from '../utils/fill'
import 'emoji-mart/css/emoji-mart.css'
import css from './Artboard.module.css'

const Artboard = () => {
  const [painting, setPainting] = useRecoilState(paintingState)
  const setHistory = useSetRecoilState(historyState)
  const tool = useRecoilValue(toolState)
  const setHistoryDelayed = useCallback(debounce(d => setHistory(d), 250), [])

  const updatePainting = useCallback((update) => {
    setPainting((oldPainting) => {
      return {
        ...oldPainting,
        ...update
      }
    })
    setHistoryDelayed((oldHistory = []) => {
      return [
        ...oldHistory,
        {
          ...painting,
          ...update,
        }
      ]
    })
  }, [painting, setHistoryDelayed, setPainting])

  // @note: this only builds the intital grid if there isn't one
  useEffect(() => {
    if (!painting.grid.length) {
      let grid = new Array(painting.height)
      for (let i = 0; i < painting.height; i++) {
        grid[i] = new Array(painting.width).fill('◽️')
      }
      updatePainting({ grid })
    }
  }, [painting, updatePainting])

  const paint = (row, col) => {
    switch (tool.type) {
      case 'draw':
        draw(row, col)
        break
      case 'fill':
        fill(row, col)
        break
      case 'erase':
        erase(row, col)
        break
      default:
        break
    }
  }

  const emojiChar = () => {
    const paint = tool.paint
    return `${paint}${String.fromCharCode(65039)}`
  }

  const draw = (row, col) => {
    const grid = cloneDeep(painting.grid)
    grid[row][col] = emojiChar()
    updatePainting({ grid })
  }

  const fill = (row, col) => {
    const grid = cloneDeep(painting.grid)
    cellsToFill(grid, { x: col, y: row }, emojiChar()).forEach(({ x, y }) => {
      grid[y][x] = emojiChar()
    })
    updatePainting({ grid })
  }

  const erase = (row, col) => {
    const grid = cloneDeep(painting.grid)
    grid[row][col] = '◽️'
    updatePainting({ grid })
  }

  return (
    <article className={css.artboard}>
      <div className="canvas">
        <Canvas
          grid={painting.grid}
          width={painting.width}
          height={painting.height}
          draw={(row, col) => paint(row, col)}
        />
      </div>
    </article>
  )
}

export default Artboard
