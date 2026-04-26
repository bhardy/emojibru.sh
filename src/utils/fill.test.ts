import cellsToFill from './fill'

interface Point {
  x: number
  y: number
}

const sorted = (points: Point[]): string[] =>
  points.map((p) => `${p.x},${p.y}`).sort()

const expectSameSet = (actual: Point[], expected: Point[]) => {
  expect(sorted(actual)).toEqual(sorted(expected))
}

describe('cellsToFill', () => {
  it('returns empty when target color already matches paint', () => {
    const grid = [
      ['◽️', '◼️'],
      ['◼️', '◼️'],
    ]
    expect(cellsToFill(grid, { x: 0, y: 0 }, '◽️')).toEqual([])
  })

  it('returns only the clicked cell when the cell is isolated', () => {
    const grid = [
      ['◽️', '◼️', '◽️', '◼️', '◼️'],
      ['◼️', '◼️', '◼️', '◼️', '◼️'],
      ['◼️', '◼️', '◽️', '◼️', '◼️'],
      ['◼️', '◼️', '◼️', '◼️', '◼️'],
      ['◼️', '◼️', '◼️', '◼️', '◼️'],
    ]
    expectSameSet(cellsToFill(grid, { x: 0, y: 0 }, '◼️'), [{ x: 0, y: 0 }])
    expectSameSet(cellsToFill(grid, { x: 2, y: 0 }, '◼️'), [{ x: 2, y: 0 }])
    expectSameSet(cellsToFill(grid, { x: 2, y: 2 }, '◼️'), [{ x: 2, y: 2 }])
  })

  it('expands to all 4 sides', () => {
    const grid = [
      ['◽️', '◽️', '◽️', '◽️', '◽️'],
      ['◽️', '◽️', '◼️', '◽️', '◽️'],
      ['◽️', '◼️', '◼️', '◼️', '◽️'],
      ['◽️', '◽️', '◼️', '◽️', '◽️'],
      ['◽️', '◽️', '◽️', '◽️', '◽️'],
    ]
    expectSameSet(cellsToFill(grid, { x: 2, y: 2 }, '◽️'), [
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 1 },
      { x: 2, y: 3 },
      { x: 3, y: 2 },
    ])
  })

  it('expands to 2 sides when blocked', () => {
    const grid = [
      ['◽️', '◽️', '◽️', '◽️', '◽️'],
      ['◽️', '◽️', '◽️', '◽️', '◽️'],
      ['◽️', '◼️', '◼️', '◽️', '◽️'],
      ['◽️', '◽️', '◼️', '◽️', '◽️'],
      ['◽️', '◽️', '◽️', '◽️', '◽️'],
    ]
    expectSameSet(cellsToFill(grid, { x: 2, y: 2 }, '◽️'), [
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 3 },
    ])
  })

  it('handles fills starting at a corner', () => {
    const grid = [
      ['◼️', '◼️', '◽️', '◽️', '◽️'],
      ['◼️', '◽️', '◽️', '◽️', '◽️'],
      ['◽️', '◽️', '◽️', '◽️', '◽️'],
      ['◽️', '◽️', '◽️', '◽️', '◽️'],
      ['◽️', '◽️', '◽️', '◽️', '◽️'],
    ]
    expectSameSet(cellsToFill(grid, { x: 0, y: 0 }, '◽️'), [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
    ])
  })

  it('finds cells reachable through a single-cell channel', () => {
    const grid = [
      ['◽️', '◽️', '◽️', '◽️', '◼️'],
      ['◽️', '◽️', '◽️', '◽️', '◽️'],
      ['◽️', '◼️', '◼️', '◽️', '◽️'],
      ['◽️', '◽️', '◼️', '◼️', '◽️'],
      ['◽️', '◽️', '◽️', '◽️', '◽️'],
    ]
    expectSameSet(cellsToFill(grid, { x: 2, y: 2 }, '◽️'), [
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
    ])
  })

  it('walks a longer connected region', () => {
    const grid = [
      ['◽️', '◽️', '◽️', '◽️', '◼️'],
      ['◽️', '◼️', '◽️', '◽️', '◽️'],
      ['◽️', '◼️', '◼️', '◽️', '◽️'],
      ['◽️', '◽️', '◼️', '◼️', '◽️'],
      ['◽️', '◽️', '◽️', '◼️', '◽️'],
    ]
    expectSameSet(cellsToFill(grid, { x: 2, y: 2 }, '◽️'), [
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
      { x: 3, y: 4 },
      { x: 1, y: 1 },
    ])
  })

  it('fills an entire uniform grid', () => {
    const grid = [
      ['◽️', '◽️', '◽️'],
      ['◽️', '◽️', '◽️'],
    ]
    expectSameSet(cellsToFill(grid, { x: 1, y: 1 }, '◼️'), [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ])
  })

  it('returns empty for out-of-bounds targets', () => {
    const grid = [
      ['◽️', '◽️'],
      ['◽️', '◽️'],
    ]
    expect(cellsToFill(grid, { x: -1, y: 0 }, '◼️')).toEqual([])
    expect(cellsToFill(grid, { x: 0, y: -1 }, '◼️')).toEqual([])
    expect(cellsToFill(grid, { x: 5, y: 0 }, '◼️')).toEqual([])
    expect(cellsToFill(grid, { x: 0, y: 5 }, '◼️')).toEqual([])
  })

  it('completes a 10x6 fill well under the 50 ms budget', () => {
    const grid = Array.from({ length: 6 }, () => Array(10).fill('🌈️'))
    const t0 = performance.now()
    cellsToFill(grid, { x: 1, y: 1 }, '❤️')
    const t1 = performance.now()
    expect(t1 - t0).toBeLessThanOrEqual(50)
  })

  it('completes a 10x15 fill well under the 500 ms budget', () => {
    const grid = Array.from({ length: 10 }, () => Array(15).fill('🌈️'))
    const t0 = performance.now()
    cellsToFill(grid, { x: 1, y: 1 }, '❤️')
    const t1 = performance.now()
    expect(t1 - t0).toBeLessThanOrEqual(500)
  })

  it('completes a 100x100 fill well under 50 ms (regression for the legacy O(n^3) blow-up)', () => {
    const grid = Array.from({ length: 100 }, () => Array(100).fill('🌈️'))
    const t0 = performance.now()
    cellsToFill(grid, { x: 0, y: 0 }, '❤️')
    const t1 = performance.now()
    expect(t1 - t0).toBeLessThanOrEqual(50)
  })
})
