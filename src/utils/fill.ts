import { uniqWith, differenceWith, isEqual } from 'lodash'
import { Painting } from '../types'

interface Point {
  x: number
  y: number
}

export default function cellsToFill(grid: Painting['grid'], target: Point, paint: string): Point[] {
  return control(grid, target, paint)
}

const control = (grid: Painting['grid'], target: Point, paint: string): Point[] => {
  const { x, y } = target

  const fillTarget = grid[y][x]

  // If no painting needs to be done return
  if (fillTarget === paint) {
    return []
  }

  let matchedCells: Point[] = []
  let cellsToCheck: Point[] = []

  cellsToCheck.push(target)

  while(cellsToCheck.length) {
    const cell = cellsToCheck.pop()!
    const adjacentCells = getAdjacent(grid, cell)
    const matchingAdjacentCells = getMatches(grid, fillTarget, adjacentCells)
    let uncheckedMatchingCells = differenceWith(matchingAdjacentCells, matchedCells, isEqual)
    uncheckedMatchingCells = differenceWith(uncheckedMatchingCells, [cell], isEqual)

    // differenceWith(uncheckedMatchingCells, [cell], isEqual)
    cellsToCheck = uniqWith([...cellsToCheck, ...uncheckedMatchingCells], isEqual)
    matchedCells = uniqWith([...matchedCells, ...matchingAdjacentCells], isEqual)
  }

  return matchedCells
}

export const getCellToCheck = (matchedCells: Point[], checkedCells: Point[]): Point | undefined => {
  return differenceWith(matchedCells, checkedCells, isEqual)[0]
}

export const getAdjacent = (grid: Painting['grid'], target: Point): Point[] => {
  const { x, y } = target
  let edges: Point[] = [ { x, y } ]
  for (let dx = -1; dx <= 1; ++dx) {
    for (let dy = -1; dy <= 1; ++dy) {
      // the distance must not be 0 && the matched absolute vals remove the corners
      if ((dx !== 0 || dy !== 0 ) && Math.abs(dy) !== Math.abs(dx)) {
        try {
          if (grid[y + dy][x + dx]) {
            edges.push({
              x: x + dx,
              y: y + dy
            })
          }
        } catch {
          // 😎 should probably refactor this
        }
      }
    }
  }
  return edges
}

export const getMatches = (grid: Painting['grid'], fillTarget: string, adjacentCells: Point[]): Point[] => {
  return adjacentCells.filter(({ x, y }) => grid[y][x] === fillTarget)
}
