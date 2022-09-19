export const SHAPE_TYPES = {
  RECTANGLE: 'rect',
  CIRCLE: 'circle',
}

export const SHAPE_DEFAULTS = {
  RECTANGLE: {
    id: 'rectangle-panel',
    type: 'rect',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    fill: 'blue',
    stroke: 'black',
    strokeWidth: 2,
  },
  CIRCLE: {
    id: 'circle-panel',
    type: 'circle',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 2,
    cx: 50,
    cy: 50,
    r: 50,
  }
}
