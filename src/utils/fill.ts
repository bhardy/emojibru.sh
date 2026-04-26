import { Painting } from '../types'

interface Point {
  x: number
  y: number
}

/**
 * Returns the set of cells that should change color when the user clicks
 * `target` on `grid` while the active paint is `paint`.
 *
 * 4-connected flood fill (no diagonals). Iterative DFS using a typed-array
 * visited mask, so each cell is examined at most once → O(width * height)
 * time and memory. The previous implementation used lodash deep-equality
 * dedup inside the BFS loop, which was effectively O(n^3) and froze the
 * UI on medium-sized canvases.
 */
export default function cellsToFill(
  grid: Painting['grid'],
  target: Point,
  paint: string,
): Point[] {
  const height = grid.length
  if (height === 0) return []
  const width = grid[0].length
  if (width === 0) return []

  const { x: startX, y: startY } = target
  if (startY < 0 || startY >= height || startX < 0 || startX >= width) {
    return []
  }

  const fillTarget = grid[startY][startX]
  if (fillTarget === paint) return []

  const visited = new Uint8Array(width * height)
  const stack: number[] = []
  const result: Point[] = []

  const startIdx = startY * width + startX
  visited[startIdx] = 1
  stack.push(startIdx)

  while (stack.length > 0) {
    const idx = stack.pop()!
    const y = (idx / width) | 0
    const x = idx - y * width

    result.push({ x, y })

    // West
    if (x > 0) {
      const n = idx - 1
      if (!visited[n] && grid[y][x - 1] === fillTarget) {
        visited[n] = 1
        stack.push(n)
      }
    }
    // East
    if (x < width - 1) {
      const n = idx + 1
      if (!visited[n] && grid[y][x + 1] === fillTarget) {
        visited[n] = 1
        stack.push(n)
      }
    }
    // North
    if (y > 0) {
      const n = idx - width
      if (!visited[n] && grid[y - 1][x] === fillTarget) {
        visited[n] = 1
        stack.push(n)
      }
    }
    // South
    if (y < height - 1) {
      const n = idx + width
      if (!visited[n] && grid[y + 1][x] === fillTarget) {
        visited[n] = 1
        stack.push(n)
      }
    }
  }

  return result
}
