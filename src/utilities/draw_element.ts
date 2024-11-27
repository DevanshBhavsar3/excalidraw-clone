import { ElementType } from "../type";

export function drawElement(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  roughCanvas: any,
  context: CanvasRenderingContext2D,
  element: ElementType
) {
  switch (element.type) {
    case "RECTANGLE":
    case "LINE":
    case "CIRCLE":
      roughCanvas.draw(element.roughElement);
      break;
    case "TEXT": {
      context.textBaseline = "top";
      context.font = "bold 48px Shadows Into Light";
      const text = element.text || "";
      context.fillText(text, element.x1, element.y1);
      break;
    }
  }
}
