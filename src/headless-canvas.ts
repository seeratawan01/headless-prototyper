// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...

import {
  isShape,
  bindEventToSVGElement,
  unbindEventToSVGElement,
  containSvg,
  createShape
} from './utils'
import Shape from './shapes/Shape'
import ShapesPanel from './panels/ShapesPanel'
import Rectangle from './shapes/Rectangle'

export interface ICanvas {
  width: number;
  height: number;
  element: HTMLElement;
}

export default class HeadlessCanvas {
  private readonly width: number
  private readonly height: number
  private element: HTMLElement
  private svgLayer: SVGElement | SVGSVGElement
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
    this.svgContainer = containSvg(this.svgLayer, {
      class: 'headless-canvas',
      style: {
        width: `${this.width}px`,
        height: `${this.height}px`
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
    })
    bindEventToSVGElement(this.svgContainer, 'dragover', (e: any) => {
      e.preventDefault()
      this.setMousePosition(e)
    })
    bindEventToSVGElement(this.svgContainer, 'drop', (e: any) => {
      e.preventDefault()
      // on drop add shape to svg canvas on mouse position
      const type = e.dataTransfer.getData('text/plain')
      const xCenterPoint = (this.mouseX - this.svgContainer.offsetLeft)
      const yCenterPoint = (this.mouseY - this.svgContainer.offsetTop)

      const shape = createShape(type, {
          id: `shape-${Math.random()}`,
          type: type,
          x: xCenterPoint - 50,
          y: yCenterPoint - 50,
          width: 100,
          height: 100,
          fill: 'transparent',
          stroke: 'black',
          strokeWidth: 1,
          cx: xCenterPoint,
          cy: yCenterPoint,
          r: 50,
        }
      )

      if (shape && isShape(shape.getShape())) {
        this.svgLayer.appendChild(shape.getShape())
      }

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
  private onMouseDown = (e: any) => {
    const target = e.target as SVGElement
    if (target && isShape(target)) {

      target.setAttribute('data-mousedown', 'true')
      e.preventDefault();
      let svg = (this.svgLayer as SVGSVGElement)

      let point = svg.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      // @ts-ignore
      point = point.matrixTransform(svg.getScreenCTM().inverse());

      let dragOffset = {
        // @ts-ignore
        x: point.x - parseFloat(target.getAttribute('x')),
        // @ts-ignore
        y: point.y - parseFloat(target.getAttribute('y'))
      }

      const mousemove = (event: any) => {
        event.preventDefault();
        point.x = event.clientX;
        point.y = event.clientY;
        // @ts-ignore
        let cursor = point.matrixTransform(svg.getScreenCTM().inverse());
        let rect = {
          x: cursor.x - dragOffset.x,
          y: cursor.y - dragOffset.y,
        }

        if (target.getAttribute('data-type') === 'rect') {

          target.setAttribute('x', rect.x.toString())
          target.setAttribute('y', rect.y.toString())
        } else if (target.getAttribute('data-type') === 'circle') {
          target.setAttribute('cx', cursor.x.toString())
          target.setAttribute('cy', cursor.y.toString())
        }
      };

      const mouseup = (event: any) => {
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);
      };

      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
    }


    // this.setState({dragOffset: {
    //     x: point.x - this.state.rect.x,
    //     y: point.y - this.state.rect.y
    //   }});
  }

  /**
   * On mouse move event
   */
  private onMouseMove = (e: MouseEvent) => {
//     this.setMousePosition(e)
// // https://codesandbox.io/s/blov5kowy?file=/index.js:1565-1574
//
//     const target = e.target as SVGElement
//     if (target && isShape(target) && target.getAttribute('data-mousedown') === 'true') {
//       const x = e.offsetX
//       const y = e.offsetY
//       target.setAttribute('x', x.toString())
//       target.setAttribute('y', y.toString())
//     }
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

  /**
   * Method to set mouse position with respect to svg container
   */
  private setMousePosition(e: MouseEvent) {
    this.mouseX = e.clientX
    this.mouseY = e.clientY
  }
}
