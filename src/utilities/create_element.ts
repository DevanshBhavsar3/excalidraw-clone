import rough from "roughjs";
import { OptionsType, Tools, ToolType } from "../type";

export function createElement(
  id: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  type: ToolType,
  options?: OptionsType
) {
  const generator = rough.generator();
  let roughElement;

  switch (type) {
    case Tools.RECTANGLE:
    case Tools.LINE:
      roughElement =
        type === Tools.LINE
          ? generator.line(x1, y1, x2, y2, options)
          : generator.rectangle(x1, y1, x2 - x1, y2 - y1, options);

      if (options?.fill === "#ffffff") {
        options.fill = undefined;
      }

      return { id, x1, y1, x2, y2, type, options, roughElement };

    case Tools.CIRCLE:
      roughElement = generator.circle(x1, y1, (x2 - x1) * 2, options);
      return { id, x1, y1, x2, y2, type, options, roughElement };
    case Tools.TEXT:
      return {
        id,
        x1,
        y1,
        x2,
        y2,
        type,
        text: "",
      };
    default:
      throw new Error("Can't create this type of shape.");
  }
}
