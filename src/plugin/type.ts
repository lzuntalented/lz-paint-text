export interface Point {
  x: number
  y: number
}
export type PaintPlugin = (ctx: CanvasRenderingContext2D, p: Point) => void