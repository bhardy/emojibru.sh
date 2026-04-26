/**
 * Benchmark / regression harness for the paint-fill algorithm.
 *
 * Skipped by default. Run with:
 *   RUN_BENCH=1 npm test -- fill.bench
 *
 * Historical baseline (lodash-based legacy implementation, ~O(n^3)):
 *     10x10 full fill : 200   ms / run
 *     15x15 full fill : 2150  ms / run
 *     20x20 full fill : 12000 ms / run   (anything bigger was effectively unusable)
 *
 * Current implementation (4-connected DFS with a Uint8Array visited mask, O(n)):
 *     10x10  : 0.003 ms
 *     25x25  : 0.012 ms
 *     50x50  : 0.05  ms
 *     100x100: 0.19  ms
 *     200x200: 1.3   ms
 *     500x500: 27    ms
 */
import cellsToFill from './fill'

const EMPTY = '◽️'
const FILL = '❤️'

const makeGrid = (width: number, height: number, cell = EMPTY): string[][] => {
  const grid: string[][] = new Array(height)
  for (let y = 0; y < height; y++) {
    grid[y] = new Array(width).fill(cell)
  }
  return grid
}

/** Run `fn` for at least `minRuns` and at least `budgetMs` of wall time. */
const time = (
  label: string,
  fn: () => void,
  {
    minRuns = 5,
    budgetMs = 1000,
  }: { minRuns?: number; budgetMs?: number } = {},
): number => {
  fn() // warm up
  const start = performance.now()
  let runs = 0
  while (runs < minRuns || performance.now() - start < budgetMs) {
    fn()
    runs++
  }
  const total = performance.now() - start
  const avg = total / runs
  console.log(
    `  ${label.padEnd(20)} ${avg.toFixed(3).padStart(10)} ms/run  (${runs} runs)`,
  )
  return avg
}

const cases: Array<{ name: string; w: number; h: number }> = [
  { name: '10x10', w: 10, h: 10 },
  { name: '25x25', w: 25, h: 25 },
  { name: '50x50', w: 50, h: 50 },
  { name: '100x100', w: 100, h: 100 },
  { name: '200x200', w: 200, h: 200 },
  { name: '500x500', w: 500, h: 500 },
]

const runBench = process.env.RUN_BENCH === '1'
const describeOrSkip = runBench ? describe : describe.skip

describeOrSkip('fill benchmark', () => {
  it('full empty-canvas fill scales linearly', () => {
    console.log('\n=== Paint-fill: full empty-canvas fill ===')
    for (const { name, w, h } of cases) {
      const grid = makeGrid(w, h)
      time(name, () => {
        cellsToFill(grid, { x: 0, y: 0 }, FILL)
      })
    }
    console.log('')
  }, 120_000)

  it('no-op when click color already matches paint', () => {
    console.log('\n=== Paint-fill: no-op (already painted) ===')
    for (const { name, w, h } of cases) {
      const grid = makeGrid(w, h, FILL)
      time(name, () => {
        cellsToFill(grid, { x: 0, y: 0 }, FILL)
      })
    }
    console.log('')
  }, 60_000)
})
