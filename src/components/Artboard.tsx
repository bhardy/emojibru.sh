import { useEffect } from 'react'
import { cloneDeep, inRange } from 'lodash'
import useStore from '../store/store'
import Canvas from './Canvas'
import cellsToFill from '../utils/fill'
import { Painting } from '@/types'
import css from './Artboard.module.css'

const Artboard = () => {
  const painting = useStore((state) => state.painting)
  const setPainting = useStore((state) => state.setPainting)
  const tool = useStore((state) => state.tool)

  const handleUpdatePainting = (update: Partial<Painting>) => {
    setPainting(update)
  }

  // @note: this only builds the intital grid if there isn't one
  useEffect(() => {
    if (!painting.grid.length) {
      const grid = new Array(painting.height)
      for (let i = 0; i < painting.height; i++) {
        grid[i] = new Array(painting.width).fill('◽️')
      }
      setPainting({ grid })
    }
  }, [painting, setPainting])

  const paint = (row: number, col: number) => {
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

  // @note: draw & erase are almost identical
  const pixel = (row: number, col: number, char: string) => {
    // @note: sometimes touch/drag events finish outside the grid, so we want to
    // check if the draw coordinates are within grid boundaries
    //
    // @note: after adding the mouseleave event to the useDrawingStatus hook,
    // this condition is no longer needed for mouse users but I need to confirm
    // the bugs can't be recreated on touch devices before removing this guard.
    if (
      !inRange(row, 0, painting.grid.length) ||
      !inRange(col, 0, painting.grid[0].length)
    ) {
      return
    }
    const grid = cloneDeep(painting.grid)
    grid[row][col] = char
    handleUpdatePainting({ grid })
  }

  const draw = (row: number, col: number) => {
    pixel(row, col, emojiChar())
  }

  const erase = (row: number, col: number) => {
    pixel(row, col, '◽️')
  }

  const fill = (row: number, col: number) => {
    const grid = cloneDeep(painting.grid)
    cellsToFill(grid, { x: col, y: row }, emojiChar()).forEach(({ x, y }) => {
      grid[y][x] = emojiChar()
    })
    handleUpdatePainting({ grid })
  }

  return (
    <article className={css.artboard}>
      <Canvas
        grid={painting.grid}
        width={painting.width}
        height={painting.height}
        draw={(row: number, col: number) => paint(row, col)}
      />
    </article>
  )
}

export default Artboard
