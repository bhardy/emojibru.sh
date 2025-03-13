export interface Painting {
  width: number
  height: number
  grid: string[][]
}

export interface Tool {
  type: 'draw' | 'fill' | 'erase'
  paint: string
  alternatePaint: string
}
