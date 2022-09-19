import Shape, { IShape } from './Shape'
import { createSVGElement } from '../utils'

export interface ICircle extends IShape {
  r: number
  cx: number
  cy: number
  pathLength?: number
}

export default class Circle extends Shape {

  private cx: number = 0
  private cy: number = 0
  private r: number = 0
  private pathLength: number = 0

  /**
   * Creates an instance of Circle
   * @param id
   * @param x
   * @param y
   * @param width
   * @param height
   * @param fill
   * @param stroke
   * @param strokeWidth
   * @param cx
   * @param cy
   * @param r
   * @param pathLength
   */
  constructor({ id, x, y, width, height, fill, stroke, strokeWidth, cx, cy, r, pathLength }: ICircle) {
    super({ id, type: 'circle', x, y, width, height, fill, stroke, strokeWidth })
    this.cx = cx
    this.cy = cy
    this.r = r
    this.shape = this.createShape()
  }

  /**
   * Creates a shape
   */
  public createShape() {
    const shape = createSVGElement(this.type, {
      id: this.id,
      class: 'shape',
      cx: this.cx,
      cy: this.cy,
      r: this.r,
      fill: this.fill,
      stroke: this.stroke,
      'stroke-width': this.strokeWidth
    })
    return shape
  }
}
