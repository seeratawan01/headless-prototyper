// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

import { isShape, bindEventToSVGElement, unbindEventToSVGElement, containSvg } from './utils'
import Shape from './shapes/Shape'
import ShapesPanel from './panels/ShapesPanel'

export interface ICanvas {
  width: number;
  height: number;
  element: HTMLElement;
}

export default class HeadlessCanvas {
  private readonly width: number
  private readonly height: number
  private element: HTMLElement
  private svgLayer: SVGElement
  private svgContainer: HTMLElement
  private mouseX: number = 0
  private mouseY: number = 0

  /**
   * Creates an instance of HeadlessCanvas.
   * @param width
   * @param height
   */
  constructor({ width, height, element }: ICanvas) {
    this.width = width
    this.height = height
    this.element = element
    this.svgLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    this.svgContainer = containSvg(this.svgLayer,{
      class: 'headless-canvas',
      style: {
        width: `${this.width}px`,
        height: `${this.height}px`,
      }
    })
  }

  /**
   * Creates a canvas with svg
   */
  public createCanvas() {
    this.svgLayer.classList.add('headless-canvas')
    this.svgLayer.setAttribute('width', this.width.toString())
    this.svgLayer.setAttribute('height', this.height.toString())
    this.svgLayer.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`)
    this.svgLayer.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    this.svgLayer.setAttribute('version', '1.1')
    this.svgLayer.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    this.svgLayer.setAttribute('xmlns:svgjs', 'http://svgjs.com/svgjs')
    this.svgLayer.setAttribute('style', 'background-color: transparent')
    this.svgLayer.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    this.svgLayer.setAttribute('class', 'svg-content')
    this.svgLayer.setAttribute('id', 'svg-content')
    this.svgContainer.appendChild(this.svgLayer)
    this.element.appendChild(this.svgContainer)
  }

  /**
   * Method to add shapes panel to the root element
   */
  public createShapesPanel() {
    const shapesPanel = new ShapesPanel()
    this.element.appendChild(shapesPanel.getPanel())
  }

  /**
   * Enable drag and drop functionality of the canvas
   */
  public enableDragAndDropEvents() {
    bindEventToSVGElement(this.svgLayer, 'mousedown', this.onMouseDown)
    bindEventToSVGElement(this.svgLayer, 'mousemove', this.onMouseMove)
    bindEventToSVGElement(this.svgLayer, 'mouseup', this.onMouseUp)

    bindEventToSVGElement(this.svgContainer, 'dragenter', (e: any) => {
      e.preventDefault()
      this.mouseX = e.clientX
      this.mouseY = e.clientY
    })
    bindEventToSVGElement(this.svgContainer, 'dragover', (e: any) => {
      e.preventDefault()
    })
    bindEventToSVGElement(this.svgContainer, 'drop', (e: any) => {
      e.preventDefault();
      console.log("drop")
      // on drop add shape to svg canvas on mouse position
      const type = e.dataTransfer.getData('text/plain')

        const shape = new Shape({
          id: `shape-${Math.random()}`,
          type:type,
          x: this.mouseX,
          y: this.mouseY,
          width: 100,
          height: 100,
          fill: 'transparent',
          stroke: 'black',
          strokeWidth: 1
        })
        this.svgLayer.appendChild(shape.getShape())
    })

  }

  /**
   * Disable drag and drop functionality of the canvas
   */
  public disableDragAndDropEvents() {
    unbindEventToSVGElement(this.svgLayer, 'mousedown', this.onMouseDown)
    unbindEventToSVGElement(this.svgLayer, 'mousemove', this.onMouseMove)
    unbindEventToSVGElement(this.svgLayer, 'mouseup', this.onMouseUp)
  }

  /**
   * Method to bind event for drop events from shapes
   */
  public bindDropEvent(callback: (type: string) => void) {
    bindEventToSVGElement(this.svgContainer, 'drop', (e: any) => {
      const type = e.dataTransfer.getData('text/plain')
      callback(type)
    })
  }

  /**
   * On mouse down event on existing shapes
   */
  private onMouseDown = (e: MouseEvent) => {
    const target = e.target as SVGElement
    if (target && isShape(target)) {
      target.setAttribute('data-mousedown', 'true')
    }
  }

  /**
   * On mouse move event
   */
  private onMouseMove = (e: MouseEvent) => {
    this.mouseX = e.clientX
    this.mouseY = e.clientY

    const target = e.target as SVGElement
    if (target && isShape(target) && target.getAttribute('data-mousedown') === 'true') {
      const x = e.offsetX
      const y = e.offsetY
      target.setAttribute('x', x.toString())
      target.setAttribute('y', y.toString())
    }
  }

  /**
   * On mouse up event
   */
  private onMouseUp = (e: MouseEvent) => {
    const target = e.target as SVGElement
    if (target && isShape(target)) {
      target.setAttribute('data-mousedown', 'false')
    }
  }
}
