import { ElementType, PointType, Tools } from "../type";

export function getElementAtPosition(
  x: number,
  y: number,
  elements: ElementType[]
) {
  return elements
    .map((element) => ({
      ...element,
      position: positionOfMouseForShape(x, y, element),
    }))
    .find((element) => element.position !== null);
}

function positionOfMouseForShape(x: number, y: number, element: ElementType) {
  const { x1, y1, x2, y2, type } = element;

  switch (type) {
    case Tools.LINE: {
      const on = onLine(x1, y1, x2, y2, x, y);
      const start = nearPoint(x, y, x1, y1, "start");
      const end = nearPoint(x, y, x2, y2, "end");

      return start || end || on;
    }
    case Tools.RECTANGLE: {
      const topLeft = nearPoint(x, y, x1, y1, "topLeft");
      const topRight = nearPoint(x, y, x2, y1, "topRight");
      const bottomLeft = nearPoint(x, y, x1, y2, "bottomLeft");
      const bottomRight = nearPoint(x, y, x2, y2, "bottomRight");
      const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;

      return topLeft || topRight || bottomLeft || bottomRight || inside;
    }
    case Tools.CIRCLE: {
      return distance({ x: x, y: y }, { x: x1, y: y1 }) < x2 - x1
        ? "inside"
        : null;
    }
    case Tools.TEXT: {
      return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
    }
  }
}

const nearPoint = (
  x: number,
  y: number,
  x1: number,
  y1: number,
  name: string
) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};

const onLine = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number,
  y: number
) => {
  const a: PointType = { x: x1, y: y1 };
  const b: PointType = { x: x2, y: y2 };
  const c: PointType = { x, y };

  const offset = distance(a, b) - (distance(a, c) + distance(b, c));

  return Math.abs(offset) < 1 ? "inside" : null;
};

const distance = (a: PointType, b: PointType) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
