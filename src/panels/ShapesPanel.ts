import Circle from '../shapes/Circle'
import Rectangle from '../shapes/Rectangle'
import {
  createSVGElement,
  bindEventToSVGElement,
  unbindEventToSVGElement,
  containSvg
} from '../utils'
import { SHAPE_DEFAULTS } from '../constants'

/**
 * A panel which contains shapes
 */
export default class ShapesPanel {
  private readonly panel: HTMLDivElement
  private readonly containedShapes: HTMLElement[]


  constructor() {
    this.panel = this.createPanel()
    this.containedShapes = this.createShapes()
    this.addShapesToPanel()
    this.bindDragAndDropEventsToShapes()
  }

  /**
   * Creates a panel
   */
  private createPanel() {
    const panel = document.createElement('div')
    panel.id = 'shapes-panel'
    return panel
  }

  /**
   * Creates shapes
   */
  private createShapes() {
    const shapes = []
    shapes.push(this.addShapeToSVG(new Circle(SHAPE_DEFAULTS.CIRCLE).getShape(), SHAPE_DEFAULTS.CIRCLE.type))
    shapes.push(this.addShapeToSVG(new Rectangle(SHAPE_DEFAULTS.RECTANGLE).getShape(), SHAPE_DEFAULTS.RECTANGLE.type))
    return shapes
  }

  /**
   * Adds shapes to panel
   */
  private addShapesToPanel() {
    this.containedShapes.forEach(shape => {
      this.panel.appendChild(shape)
    })
  }

  /**
   * Add Shape into svg
   */
  private addShapeToSVG(shape: SVGElement, type: string) {
    // create svg element
    const svg = createSVGElement('svg', {
      width: '100',
      height: '100',
      viewBox: '0 0 100 100',
      'data-type': type
    })

    // add shape to svg
    svg.appendChild(shape)

    return containSvg(svg, {
      draggable: true,
      class: 'panel-shape-box'
    })
  }

  /**
   * Bind drag and drop events to shapes
   */
  public bindDragAndDropEventsToShapes() {
    this.containedShapes.forEach(box => {
      let svg = box.querySelector('svg')
      if (svg) {
        bindEventToSVGElement(box, 'dragstart', (event: any) => {
          event.dataTransfer.setData('text/plain', svg?.getAttribute('data-type'))
        })
      }
    })
  }

  /**
   * Returns the panel
   */
  public getPanel() {
    return this.panel
  }
}
