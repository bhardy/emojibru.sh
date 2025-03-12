import cellsToFill, * as fill from './fill'

describe('helper functions', () => {
  const grid = [
    [ '◽️', '◽️', '◽️', '◽️', '◽️' ],
    [ '◽️', '◽️', '◽️', '◽️', '◽️' ],
    [ '◽️', '◽️', '◽️', '◽️', '◽️' ],
    [ '◽️', '◽️', '◽️', '◽️', '◽️' ],
    [ '◽️', '◽️', '◽️', '◽️', '◽️' ]
  ]

  it('getAdjacent() returns the adjacent cells', () => {
    const target = { x: 2, y: 2 }
    const result = [
      { x: 2, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 1 }, { x: 2, y: 3 }, { x: 3, y: 2 }
    ]
    expect(fill.getAdjacent(grid, target)).toEqual(result)
  })

  it('getAdjacent() works with rectangles', () => {
    const grid = [
      [ '◽️', '◽️', '◽️' ],
      [ '◽️', '◽️', '◽️' ]
    ]
    const target = { x: 2, y: 1 }
    const result = [
      { x: 2, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 0  }
    ]
    expect(fill.getAdjacent(grid, target)).toEqual(result)
  })

  it('getAdjacent() works with big rectangles', () => {
    const grid = [
      [ '◽️', '◽️', '◽️', '◽️', '◽️' ],
      [ '◽️', '◽️', '◽️', 'x◽️', '◽️' ],
      [ '◽️', '◽️', '◽️', '◽️', '◽️' ],
    ]
    const target = { x: 3, y: 1 }
    const result = [
      { x: 3, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 0 }, { x: 3, y: 2 }, { x: 4, y: 1 }
    ]
    expect(fill.getAdjacent(grid, target)).toEqual(result)
  })

  it('getMatches() returns the matching adjacent cells', () => {
    const grid = [
      [ '◼️', '◼️', '◼️', '◼️', '◼️' ],
      [ '◼️', '◼️', '◽️', '◼️', '◼️' ],
      [ '◼️', '◽️', '◽️', '◽️', '◼️' ],
      [ '◼️', '◼️', '◼️', '◼️', '◼️' ],
      [ '◼️', '◼️', '◼️', '◼️', '◼️' ]
    ]
    const fillTarget = '◽️'
    const adjacentCells = [
      { x: 2, y: 2 }, { x: 2, y: 1 }, { x: 3, y: 2 }, { x: 2, y: 3 }, { x: 1, y: 2 }
    ]
    const result = [
      { x: 2, y: 2 }, { x: 2, y: 1 }, { x: 3, y: 2 }, { x: 1, y: 2 }
    ]
    expect(fill.getMatches(grid, fillTarget, adjacentCells)).toEqual(result)
  })

  it('getMatches() works with rectangles', () => {
    const grid = [
      [ '◽️', '◽️', '◽️' ],
      [ '◽️', '◽️', '◽️' ]
    ]
    const fillTarget = '◽️'
    const adjacentCells = [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }
    ]
    const result = [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }
    ]
    expect(fill.getMatches(grid, fillTarget, adjacentCells)).toEqual(result)
  })

  it('returns an unchecked cell', () => {
    const matchedCells = [ { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 1, y: 2 }, { x: 2, y: 4 } ]
    const checkedCells = [ { x: 2, y: 2 }, { x: 1, y: 2 }, { x: 4, y: 2 } ]
    const result = { x: 2, y: 3 }
    expect(fill.getCellToCheck(matchedCells, checkedCells)).toEqual(result)
  })
})

describe('default function', () => {
  // @todo most of these tests could probably use 1 grid
  it('only returns the clicked cell', () => {
    const grid = [
      [ '◽️', '◼️', '◽️', '◼️', '◼️' ],
      [ '◼️', '◼️', '◼️', '◼️', '◼️' ],
      [ '◼️', '◼️', '◽️', '◼️', '◼️' ],
      [ '◼️', '◼️', '◼️', '◼️', '◼️' ],
      [ '◼️', '◼️', '◼️', '◼️', '◼️' ]
    ]
    let target = { x: 0, y: 0 }
    expect(cellsToFill(grid, target, '◼️')).toEqual([ target ])
    target = { x: 2, y: 0 }
    expect(cellsToFill(grid, target, '◼️')).toEqual([ target ])
    target = { x: 2, y: 2 }
    expect(cellsToFill(grid, target, '◼️')).toEqual([ target ])
  })

  it('returns all 4 sides', () => {
    const target = { x: 2, y: 2 }
    const grid = [
      [ '◽️', '◽️', '◽️', '◽️', '◽️' ],
      [ '◽️', '◽️', '◼️', '◽️', '◽️' ],
      [ '◽️', '◼️', '◼️', '◼️', '◽️' ],
      [ '◽️', '◽️', '◼️', '◽️', '◽️' ],
      [ '◽️', '◽️', '◽️', '◽️', '◽️' ]
    ]
    const result = [
      { x: 2, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 1 }, { x: 2, y: 3 }, { x: 3, y: 2 }
    ]
    expect(cellsToFill(grid, target, '◽️')).toEqual(result)
  })

  it('returns 2 sides', () => {
    const target = { x: 2, y: 2 }
    const grid = [
      [ '◽️', '◽️', '◽️', '◽️', '◽️' ],
      [ '◽️', '◽️', '◽️', '◽️', '◽️' ],
      [ '◽️', '◼️', '◼️', '◽️', '◽️' ],
      [ '◽️', '◽️', '◼️', '◽️', '◽️' ],
      [ '◽️', '◽️', '◽️', '◽️', '◽️' ]
    ]
    const result = [
      { x: 2, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 3 }
    ]
    expect(cellsToFill(grid, target, '◽️')).toEqual(result)
  })

  it('returns 2 sides from a corner', () => {
    const target = { x: 0, y: 0 }
    const grid = [
      [ '◼️', '◼️', '◽️', '◽️', '◽️' ],
      [ '◼️', '◽️', '◽️', '◽️', '◽️' ],
      [ '◽️', '◽️', '◽️', '◽️', '◽️' ],
      [ '◽️', '◽️', '◽️', '◽️', '◽️' ],
      [ '◽️', '◽️', '◽️', '◽️', '◽️' ]
    ]
    const result = [
      { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }
    ]
    expect(cellsToFill(grid, target, '◽️')).toEqual(result)
  })

  it('returns recursive matches', () => {
    const target = { x: 2, y: 2 }
    const grid = [
      [ '◽️', '◽️', '◽️', '◽️', '◼️' ],
      [ '◽️', '◽️', '◽️', '◽️', '◽️' ],
      [ '◽️', '◼️', '◼️', '◽️', '◽️' ],
      [ '◽️', '◽️', '◼️', '◼️', '◽️' ],
      [ '◽️', '◽️', '◽️', '◽️', '◽️' ]
    ]
    const result = [
      { x: 2, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 3 }
    ]
    expect(cellsToFill(grid, target, '◽️')).toEqual(result)
  })

  it('returns doubly recursive matches', () => {
    const target = { x: 2, y: 2 }
    const grid = [
      [ '◽️', '◽️', '◽️', '◽️', '◼️' ],
      [ '◽️', '◼️', '◽️', '◽️', '◽️' ],
      [ '◽️', '◼️', '◼️', '◽️', '◽️' ],
      [ '◽️', '◽️', '◼️', '◼️', '◽️' ],
      [ '◽️', '◽️', '◽️', '◼️', '◽️' ]
    ]
    const result = [
      { x: 2, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 1, y: 1 }
    ]
    expect(cellsToFill(grid, target, '◽️')).toEqual(result)
  })

  it('does a full fill', () => {
    const target = { x: 1, y: 1 }
    const grid = [
      [ '◽️', '◽️', '◽️' ],
      [ '◽️', '◽️', '◽️' ]
    ]
    const result = [
      { x: 1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 0 }, { x: 0, y: 0 }
    ]
    expect(cellsToFill(grid, target, '◼️')).toEqual(result)
  })

  it('does a bigger fill', () => {
    const target = { x: 1, y: 1 }
    const grid = [
      [ '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️' ],
      [ '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️' ],
      [ '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️' ],
      [ '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️' ],
      [ '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️' ],
      [ '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️' ],
      [ '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️' ],
      [ '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️' ],
      [ '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️' ],
      [ '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️' ]
    ]
    const t0 = performance.now()
    cellsToFill(grid, target, '❤️')
    const t1 = performance.now()

    expect(t1 - t0).toBeLessThanOrEqual(50)
  })

  it('does a fill fast', () => {
    const target = { x: 1, y: 1 }
    const grid = [
      [ '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', ],
      [ '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', ],
      [ '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', ],
      [ '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', ],
      [ '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', ],
      [ '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', ],
      [ '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', ],
      [ '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', ],
      [ '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', ],
      [ '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', '🌈️', ]
    ]
    const t0 = performance.now()
    cellsToFill(grid, target, '❤️')
    const t1 = performance.now()

    expect(t1 - t0).toBeLessThanOrEqual(500)
  })
})
