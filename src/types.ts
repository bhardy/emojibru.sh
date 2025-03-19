export interface Painting {
  width: number
  height: number
  grid: string[][]
}

export interface Tool {
  type: 'draw' | 'fill' | 'erase' | 'pan'
  paint: string
  alternatePaint: string
}
