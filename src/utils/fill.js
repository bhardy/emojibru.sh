import { uniqWith, differenceWith, isEqual } from 'lodash'

export default function cellsToFill(grid, target) {
  return control(grid, [target])
}

const control = (grid, matchedCells = [], checkedCells = []) => {
  // choose a matching cell that hasn't been checked
  const target = getCellToCheck(matchedCells, checkedCells)
  // console.log({target})

  // if there are no matching cells that are unchecked return the matching cells
  if (!target) {
    return matchedCells;
  }

  // get the value of the matching cell
  const { x, y } = target
  const fillTarget = grid[y][x]

  // get cells
  const adjacentCells = getSides(grid, target)
  const matchingAdjacentCells = getMatches(grid, fillTarget, adjacentCells)
  const combinedMatchingCells = uniqWith(matchedCells.concat(matchingAdjacentCells), isEqual)

  // add current target to checked cells
  const combinedCheckedCells = uniqWith(checkedCells.concat(target), isEqual)

  // get unchecked cells
  const uncheckedCells = differenceWith(combinedMatchingCells, combinedCheckedCells, isEqual)

  // if there are unchecked cells re-check, otherwise return matching
  if (uncheckedCells.length > 0) {
    return control(grid, combinedMatchingCells, combinedCheckedCells)
  }

  return combinedMatchingCells
}

export const getCellToCheck = (matchedCells, checkedCells) => {
  return differenceWith(matchedCells, checkedCells, isEqual)[0]
}

export const getAdjacent = (grid, target) => {
  const { x, y } = target;
  let edges = [ { x, y }];
  for (let dx = -1; dx <= 1; ++dx) {
    for (let dy = -1; dy <= 1; ++dy) {
      // 1 direction must not be 0 && the absolute vals remove the corners
      if ((dx !== 0 || dy !== 0 ) && Math.abs(dy) !== Math.abs(dx)) {
        try {
          if (grid[x + dx][y + dy]) {
            edges.push({
              x: x + dx,
              y: y + dy
            })
          }
        } catch {
          console.log('hit an edge')
        }
      }
    }
  }
  return edges
}

export const getSides = (grid, target) => {
  const { x, y } = target;
  let edges = [ { x, y } ] ;
  // Top
  try {
    let dx = 0
    let dy = -1
    if (grid[x + dx][y + dy]) {
      edges.push({
        x: x + dx,
        y: y + dy
      })
    }
  } catch {
    console.log('hit an edge')
  }
  // Right
  try {
    let dx = 1
    let dy = 0
    if (grid[x + dx][y + dy]) {
      edges.push({
        x: x + dx,
        y: y + dy
      })
    }
  } catch {
    console.log('hit an edge')
  }
  // Bottom
  try {
    let dx = 0
    let dy = 1
    if (grid[x + dx][y + dy]) {
      edges.push({
        x: x + dx,
        y: y + dy
      })
    }
  } catch {
    console.log('hit an edge')
  }
  // left
  try {
    let dx = -1
    let dy = 0
    if (grid[x + dx][y + dy]) {
      edges.push({
        x: x + dx,
        y: y + dy
      })
    }
  } catch {
    console.log('hit an edge')
  }
  return edges
}

export const getMatches = (grid, fillTarget, adjacentCells) => {
  return adjacentCells.filter(({ x, y }) => grid[y][x] === fillTarget)
}
