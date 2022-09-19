/**
 * Helper function to create SVGs elements dynamically
 */
import Circle from '../shapes/Circle'
import Rectangle from '../shapes/Rectangle'

export function createSVGElement(tag: string, attrs: any) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag)
  for (const k in attrs) {
    el.setAttribute(k, attrs[k])
  }
  return el
}

/**
 * Helper function to bind events to SVGs elements
 */
export function bindEventToSVGElement(el: any, eventName: string, callback: any) {
  el.addEventListener(eventName, callback)
}

/**
 * Helper function to unbind events to SVGs elements
 */
export function unbindEventToSVGElement(el: any, eventName: string, callback: any) {
  el.removeEventListener(eventName, callback)
}

/**
 * Helper function to update SVGs existing elements
 * also manage nested attributes
 */
export function updateSVGElement(el: any, attrs: any) {
  for (const k in attrs) {
    if (k === 'style') {
      for (const style in attrs[k]) {
        el.style[style] = attrs[k][style]
      }
    } else {
      el.setAttribute(k, attrs[k])
    }
  }
}

/**
 * Helper function to check if interacted element is shape
 */
export function isShape(el: any) {
  return el.classList.contains('shape')
}


/**
 * Helper function to create a box around a svg
 * also manage nested attributes
 */
export function containSvg(svg: any, attrs: any) {
  const box = document.createElement('div')

  for (const k in attrs) {
    if (k === 'style') {
      for (const style in attrs[k]) {
        // @ts-ignore
        box.style[style] = attrs[k][style]
      }
    } else {
      box.setAttribute(k, attrs[k])
    }
  }

  box.append(svg)
  return box
}


/**
 * Helper function to create a shape based on type
 */
export function createShape(type: string, attrs: any) {
  switch (type) {
    case 'circle':
      return new Circle(attrs)
    case 'rect':
      return new Rectangle(attrs)
    default:
      return null
  }
}
