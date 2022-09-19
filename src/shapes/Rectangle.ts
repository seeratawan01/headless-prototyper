import Shape, { IShape } from './Shape'

export default class Rectangle extends Shape {

  /**
   * Creates an instance of Rectangle
   * @param id
   * @param x
   * @param y
   * @param width
   * @param height
   * @param fill
   * @param stroke
   * @param strokeWidth
   */
  constructor({ id, x, y, width, height, fill, stroke, strokeWidth }: IShape) {
    super({ id, type: 'rect', x, y, width, height, fill, stroke, strokeWidth })
  }


}
