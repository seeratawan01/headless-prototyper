import { createSVGElement, updateSVGElement } from '../utils'

export interface IShape {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

/**
 * Base class for all shapes to drag and drop into svg
 */
export default class Shape {
  protected id: string
  protected type: string
  protected x: number
  protected y: number
  protected width: number
  protected height: number
  protected fill: string
  protected stroke: string
  protected strokeWidth: number
  protected shape: SVGElement

  constructor({ id, type, x, y, width, height, fill, stroke, strokeWidth }: IShape) {
    this.id = id
    this.type = type
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.fill = fill
    this.stroke = stroke
    this.strokeWidth = strokeWidth
    this.shape = this.createShape()
  }

  /**
   * Creates a shape
   */
  public createShape() {
    const shape = createSVGElement(this.type, {
      id: this.id,
      class: 'shape',
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      fill: this.fill,
      stroke: this.stroke,
      'stroke-width': this.strokeWidth,
      'data-type': this.type
    })
    return shape
  }

  /**
   * Bind events to a shape
   */
  public bindEventsToShape(eventName: string, callback: any) {
    this.shape.addEventListener(eventName, callback)
  }


  /**
   * Updates a shape
   */
  public updateShape({ x, y, width, height, fill, stroke, strokeWidth }: IShape) {
    updateSVGElement(this.shape, {
      x,
      y,
      width,
      height,
      fill,
      stroke,
      'stroke-width': strokeWidth
    })
  }

  /**
   * Returns a shape
   */
  public getShape() {
    return this.shape
  }
}
