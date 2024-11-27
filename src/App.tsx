import {
  MouseEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import TextareaAutosize from "react-textarea-autosize";
import rough from "roughjs";
import Actionbar from "./components/Actionbar";
import Toolbar from "./components/Toolbar";
import { useHistory } from "./hooks/useHistory";
import { usePressedKeys } from "./hooks/usePressedKeys";
import {
  ActionType,
  ElementType,
  OptionsType,
  SelectedElementType,
  Tools,
  ToolType,
} from "./type";
import { adjustElementCoordinates } from "./utilities/adjust_element_coordinates";
import { createElement } from "./utilities/create_element";
import { cursorForPosition } from "./utilities/cursor_for_position";
import { drawElement } from "./utilities/draw_element";
import { getElementAtPosition } from "./utilities/get_element_at_position";
import { resizedCoordinates } from "./utilities/resized_coordinates";

export default function App() {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState<ToolType>("SELECTION");
  const { elements, setElements, undo, redo } = useHistory([]);
  const [selectedElement, setSelectedElement] =
    useState<SelectedElementType | null>();
  const [action, setAction] = useState<ActionType>("NONE");
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 });
  const [panStartMousePosition, setPanStartMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const [roughness, setRoughness] = useState(1);
  const [curving, setCurving] = useState(10);
  const [fill, setFill] = useState("#ffffff");
  const [stroke, setStroke] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [fillStyle, setFillStyle] = useState("solid");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pressedKeys = usePressedKeys();

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    const roughCanvas = rough.canvas(canvas);

    context.clearRect(0, 0, canvas.width, canvas.height);

    const scaledWidth = canvas.width * scale;
    const scaledHeight = canvas.height * scale;
    const scaleOffsetX = (scaledWidth - canvas.width) / 2;
    const scaleOffsetY = (scaledHeight - canvas.height) / 2;
    setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY });

    context.save();
    context.translate(
      panOffset.x * scale - scaleOffsetX,
      panOffset.y * scale - scaleOffsetY
    );
    context.scale(scale, scale);

    const textElements: ElementType[] = [];

    elements.forEach((element) => {
      if (
        action === "WRITING" &&
        selectedElement &&
        selectedElement.id === element.id
      ) {
        return;
      }
      if (element.type === "TEXT") {
        textElements.push(element);
      } else {
        drawElement(roughCanvas, context, element);
      }
    });

    textElements.forEach((textElement) =>
      drawElement(roughCanvas, context, textElement)
    );

    context.restore();
  }, [elements, action, selectedElement, panOffset, scale]);

  useEffect(() => {
    const handleUndoAndRedo = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        if (event.key === "z") {
          if (event.shiftKey) {
            redo();
          } else {
            undo();
          }
        } else if (event.key === "y") {
          redo();
        }
      }
    };

    document.addEventListener("keydown", handleUndoAndRedo);

    return () => document.removeEventListener("keydown", handleUndoAndRedo);
  }, [undo, redo]);

  useEffect(() => {
    const handlePanOrZoom = (event: WheelEvent) => {
      if (pressedKeys.has("Meta") || pressedKeys.has("Control")) {
        onZoom(event.deltaY * -0.01);
      } else {
        setPanOffset((prevState) => ({
          x: prevState.x - event.deltaX,
          y: prevState.y - event.deltaY,
        }));
      }
    };

    window.addEventListener("wheel", handlePanOrZoom);

    return () => window.removeEventListener("wheel", handlePanOrZoom);
  }, [pressedKeys]);

  useEffect(() => {
    const textInput = inputRef.current;

    if (action === "WRITING" && selectedElement && textInput) {
      setTimeout(() => {
        textInput.focus();
        textInput.value = selectedElement.text || "";
      }, 0);
    }
  }, [action, selectedElement]);

  const updateElement = (
    id: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    tool: ToolType,
    options?: OptionsType
  ) => {
    const elementsCopy = [...elements];

    switch (tool) {
      case Tools.RECTANGLE:
      case Tools.CIRCLE:
      case Tools.LINE:
        elementsCopy[id] = createElement(id, x1, y1, x2, y2, tool, options);
        break;
      case Tools.TEXT: {
        const canvas = document.getElementById("canvas");

        if (!(canvas instanceof HTMLCanvasElement))
          throw new Error("Canvas not found.");

        const context = canvas.getContext("2d");

        if (!context) throw new Error("Could not get 2d Context.");

        if (!options) throw new Error("Could not get text option.");

        const textWidth = context.measureText(options.text || "").width;
        const textHeight = 24;

        elementsCopy[id] = {
          ...createElement(id, x1, y1, x1 + textWidth, y1 + textHeight, tool),
          text: options?.text,
        };
        break;
      }
    }

    setElements(elementsCopy, true);
  };

  const getMouseCoordinates = (event: MouseEvent) => {
    const clientX =
      (event.clientX - panOffset.x * scale + scaleOffset.x) / scale;
    const clientY =
      (event.clientY - panOffset.y * scale + scaleOffset.y) / scale;

    return { clientX, clientY };
  };

  const handleMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    if (action === "WRITING") return;

    const { clientX, clientY } = getMouseCoordinates(event);

    if (tool === Tools.PAN || pressedKeys.has(" ")) {
      setAction("PANNING");
      setPanStartMousePosition({ x: clientX, y: clientY });
      document.body.style.cursor = "grabbing";
      return;
    }

    if (pressedKeys.has(" ")) {
      setAction("PANNING");
      setPanStartMousePosition({ x: clientX, y: clientY });
      document.body.style.cursor = "grabbing";
      return;
    }

    if (tool === Tools.SELECTION) {
      const element = getElementAtPosition(clientX, clientY, elements);

      if (element) {
        const selectedElement: SelectedElementType = {
          ...element,
          offsetX: clientX - element.x1,
          offsetY: clientY - element.y1,
        };

        setSelectedElement(selectedElement);
        setElements((prevElements) => prevElements);

        if (element.position === "inside") {
          setAction("MOVING");
        } else {
          setAction("RESIZING");
        }
      }
    } else {
      const id = elements.length;

      const newElement = createElement(
        id,
        clientX,
        clientY,
        clientX,
        clientY,
        tool,
        { roughness, curving, fill, stroke, strokeWidth, fillStyle }
      );

      setElements((prevElements) => [...prevElements, newElement]);
      setSelectedElement(newElement);
      setAction(tool === "TEXT" ? "WRITING" : "DRAWING");
    }
  };

  const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = getMouseCoordinates(event);

    if (action === "PANNING") {
      const deltaX = clientX - panStartMousePosition.x;
      const deltaY = clientY - panStartMousePosition.y;

      setPanOffset({ x: panOffset.x + deltaX, y: panOffset.y + deltaY });
      return;
    }

    if (tool === Tools.SELECTION) {
      const element = getElementAtPosition(clientX, clientY, elements);

      if (element && element.position) {
        (event.target as HTMLElement).style.cursor = cursorForPosition(
          element.position
        );
      } else {
        (event.target as HTMLElement).style.cursor = "default";
      }
    }

    if (action === "DRAWING") {
      const index = elements.length - 1;
      const { x1, y1, options } = elements[index];
      updateElement(index, x1, y1, clientX, clientY, tool, options);
    } else if (action === "MOVING" && selectedElement) {
      const { id, x1, y1, x2, y2, type, offsetX, offsetY } =
        selectedElement as SelectedElementType;
      const safeOffsetX = offsetX ?? 0;
      const safeOffsetY = offsetY ?? 0;

      const newX1 = clientX - safeOffsetX;
      const newY1 = clientY - safeOffsetY;

      const newX2 = newX1 + (x2 - x1);
      const newY2 = newY1 + (y2 - y1);

      const options =
        type === "TEXT" && selectedElement.text
          ? {
              text: selectedElement.text,
            }
          : selectedElement.options;

      updateElement(id, newX1, newY1, newX2, newY2, type, options);
    } else if (
      action === "RESIZING" &&
      selectedElement &&
      selectedElement.position
    ) {
      const { id, type, position, options, ...coordinates } =
        selectedElement as ElementType;

      if (typeof position === "string") {
        const { x1, y1, x2, y2 } = resizedCoordinates(
          clientX,
          clientY,
          position,
          coordinates
        );

        updateElement(id, x1, y1, x2, y2, type, options);
      }
    }
  };

  const handleMouseUp = (event: MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = getMouseCoordinates(event);

    if (selectedElement) {
      const index = selectedElement.id;
      const { id, type, options } = elements[index];

      if (
        (action === "DRAWING" || action === "RESIZING") &&
        (type === Tools.RECTANGLE || type === Tools.LINE)
      ) {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
        updateElement(id, x1, y1, x2, y2, type, options);
      }

      const offsetX = selectedElement.offsetX || 0;
      const offsetY = selectedElement.offsetY || 0;

      if (
        selectedElement.type === "TEXT" &&
        clientX - offsetX === selectedElement.x1 &&
        clientY - offsetY === selectedElement.y1
      ) {
        setAction("WRITING");
        return;
      }
    }

    if (action === "WRITING") return;

    if (action === "PANNING") {
      document.body.style.cursor = "default";
    }

    setAction("NONE");
    setSelectedElement(null);
  };

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    if (selectedElement) {
      const { id, x1, y1, type } = selectedElement;

      const x2 = selectedElement.x2 || x1;
      const y2 = selectedElement.y2 || y1;

      setAction("NONE");
      setSelectedElement(null);
      updateElement(id, x1, y1, x2, y2, type, {
        text: event.target.value,
      });
    }
  };

  const onZoom = (delta: number) => {
    setScale((prevScale) => Math.min(Math.max(prevScale + delta, 0.1), 20));
  };

  return (
    <div>
      <Actionbar
        tool={tool}
        setTool={setTool}
        roughness={roughness}
        curving={curving}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fillStyle={fillStyle}
        setRoughness={setRoughness}
        setCurving={setCurving}
        setFill={setFill}
        setStroke={setStroke}
        setStrokeWidth={setStrokeWidth}
        setFillStyle={setFillStyle}
        canvasRef={canvasRef}
      />

      {action === "WRITING" ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={handleBlur}
          className={`fixed resize-none border-none overflow-hidden bg-white/0 outline-none`}
          style={{
            top: `${
              selectedElement
                ? selectedElement.y1 * scale +
                  panOffset.y * scale -
                  scaleOffset.y
                : 0
            }px`,
            left: `${
              selectedElement
                ? selectedElement.x1 * scale +
                  panOffset.x * scale -
                  scaleOffset.x
                : 0
            }px`,
            font: `bold ${48 * scale}px Shadows Into Light`,
            lineHeight: `${48 * scale}px`,
          }}
        />
      ) : null}

      <canvas
        id="canvas"
        ref={canvasRef}
        className={"w-[100vw] h-[100vh]"}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        height={window.innerHeight}
        width={window.innerWidth}
      />

      <Toolbar
        undo={undo}
        redo={redo}
        onZoom={onZoom}
        scale={scale}
        setScale={setScale}
      />
    </div>
  );
}
