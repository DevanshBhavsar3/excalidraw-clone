import ControlPanel from "./ControlPanel";
import { Tools, ToolType } from "../type";
import { exportComponentAsJPEG } from "react-component-export-image";

// Icons
import { BsDashLg } from "react-icons/bs";
import { FaRegCircle, FaRegHandPaper } from "react-icons/fa";
import { FiMousePointer } from "react-icons/fi";
import { PiTextAa } from "react-icons/pi";
import { RiRectangleLine } from "react-icons/ri";
import { IoCloudDownloadOutline } from "react-icons/io5";

type ActionbarProp = {
  tool: ToolType | null;
  setTool: (tool: ToolType) => void;
  roughness: number;
  curving: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  fillStyle: string;
  setRoughness: (roughness: number) => void;
  setCurving: (curving: number) => void;
  setFill: (fill: string) => void;
  setStroke: (stroke: string) => void;
  setStrokeWidth: (strokeWidth: number) => void;
  setFillStyle: (fillStyle: string) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
};

export default function Actionbar({
  tool,
  setTool,
  roughness,
  curving,
  fill,
  stroke,
  strokeWidth,
  fillStyle,
  setRoughness,
  setCurving,
  setFill,
  setStroke,
  setStrokeWidth,
  setFillStyle,
  canvasRef,
}: ActionbarProp) {
  return (
    <div>
      <div
        id="actionbar"
        className={`fixed backdrop-blur-md h-auto w-auto top-4 left-1/2 -translate-x-1/2 rounded-xl flex select-none border-2 border-solid border-gray/10
        `}
      >
        {Object.values(Tools).map((t, index) => (
          <div
            key={t}
            className={`flex py-2 m-1 rounded-lg cursor-pointer ${
              tool === t ? "bg-indigo-600/70 text-white" : ""
            } `}
            onClick={() => setTool(t as ToolType)}
          >
            <div className="flex self-center pl-2">
              <input
                type="radio"
                checked={tool === t}
                name="Tools"
                className="appearance-none hidden"
                onChange={() => setTool(t as ToolType)}
              />
              {t === "PAN" && <FaRegHandPaper className="text-xl" />}
              {t === "SELECTION" && <FiMousePointer className="text-xl" />}
              {t === "RECTANGLE" && <RiRectangleLine className="text-xl" />}
              {t === "CIRCLE" && <FaRegCircle className="text-xl" />}
              {t === "LINE" && <BsDashLg className="text-xl" />}
              {t === "TEXT" && <PiTextAa className="text-xl" />}
            </div>
            <label
              htmlFor="Tools"
              className={`text-xs mt-3 mx-1 ${
                tool === t ? "text-white" : "text-gray-500/80"
              }`}
            >
              {index + 1}
            </label>
          </div>
        ))}
      </div>

      <button
        className="fixed top-4 left-[95%] p-2 rounded-md bg-indigo-600/70"
        onClick={() => canvasRef.current && exportComponentAsJPEG(canvasRef)}
      >
        <IoCloudDownloadOutline className="text-white text-2xl" />
      </button>

      {tool && ["RECTANGLE", "CIRCLE", "LINE"].includes(tool) ? (
        <ControlPanel
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
        />
      ) : undefined}
    </div>
  );
}
