export function cursorForPosition(position: string) {
  switch (position) {
    case "topLeft":
    case "bottomRight":
      return "nwse-resize";
    case "topRight":
    case "bottomLeft":
    case "start":
    case "end":
      return "nesw-resize";
    case "inside":
      return "move";
    default:
      return "default";
  }
}
