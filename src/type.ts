export type ElementType = {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: ToolType;
  options?: OptionsType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  roughElement?: any;
  text?: string;
  position?: string | null;
};

export type SelectedElementType = ElementType & {
  offsetX?: number;
  offsetY?: number;
};

export type ActionType =
  | "PANNING"
  | "RESIZING"
  | "DRAWING"
  | "WRITING"
  | "MOVING"
  | "NONE";

export const Tools = {
  PAN: "PAN",
  SELECTION: "SELECTION",
  RECTANGLE: "RECTANGLE",
  CIRCLE: "CIRCLE",
  LINE: "LINE",
  TEXT: "TEXT",
};

export type ToolType = keyof typeof Tools;

export type PointType = { x: number; y: number };

export type OptionsType = {
  text?: string;
  roughness?: number;
  curving?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  fillStyle?: string;
};
