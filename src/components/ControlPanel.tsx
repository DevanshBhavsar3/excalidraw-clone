// icons
import { MdOutlineRectangle } from "react-icons/md";
import { FaMinus } from "react-icons/fa";
import { HiOutlineMinus } from "react-icons/hi";
import { HiMinus } from "react-icons/hi2";
import { BiSolidRectangle } from "react-icons/bi";
import { CgViewMonth } from "react-icons/cg";

type ControlPanelProps = {
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
};

export default function ControlPanel({
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
}: ControlPanelProps) {
  return (
    <div className="fixed backdrop-blur-md p-5 top-1/4 left-5 border-2 border-solid border-gray/10 rounded-md  w-auto h-auto font-semibold flex items-center overflow-auto select-none">
      <div>
        <label htmlFor="roughness">Roughness: {roughness}</label>
        <br />
        <input
          type="range"
          id="roughness"
          min={0}
          max={10}
          value={roughness}
          className="mb-5 cursor-ew-resize accent-indigo-600/70"
          onChange={(e) => setRoughness(Number(e.target.value))}
        />

        <br />

        <label htmlFor="curving">Curving: {curving / 10}</label>
        <br />
        <input
          type="range"
          id="curving"
          min={0}
          max={10}
          value={curving}
          className="mb-5 cursor-ew-resize accent-indigo-600/70"
          onChange={(e) => setCurving(Number(e.target.value))}
        />

        <br />

        <label htmlFor="fill">Fill:</label>
        <br />
        <input
          type="color"
          id="fill"
          className="mb-5 cursor-pointer"
          value={fill}
          onChange={(e) => setFill(e.target.value)}
        />

        <br />

        <label htmlFor="stroke">Stroke:</label>
        <br />
        <input
          type="color"
          id="stroke"
          className="mb-5 cursor-pointer"
          value={stroke}
          onChange={(e) => setStroke(e.target.value)}
        />

        <br />

        <label htmlFor="strokeWidth">Stroke Width:</label>
        <div id="strokeWidth" className=" flex mb-5">
          <div
            className={`rounded-md p-1 m-2 ml-0 cursor-pointer ${
              strokeWidth === 1
                ? "bg-indigo-600/70 text-white"
                : "bg-gray-600/10"
            }`}
            onClick={() => setStrokeWidth(1)}
          >
            <input
              type="radio"
              id="default"
              className="hidden"
              checked={strokeWidth === 1}
              onChange={() => setStrokeWidth(1)}
            />
            <HiMinus className="text-2xl" />
          </div>
          <div
            className={`rounded-md p-1 m-2 ml-0 cursor-pointer ${
              strokeWidth === 3
                ? "bg-indigo-600/70 text-white"
                : "bg-gray-600/10"
            }`}
            onClick={() => setStrokeWidth(3)}
          >
            <input
              type="radio"
              id="medium"
              className="hidden"
              checked={strokeWidth === 3}
              onChange={() => setStrokeWidth(3)}
            />
            <HiOutlineMinus className="text-2xl" />
          </div>
          <div
            className={`rounded-md p-1 m-2 ml-0 cursor-pointer ${
              strokeWidth === 5
                ? "bg-indigo-600/70 text-white"
                : "bg-gray-600/10"
            }`}
            onClick={() => setStrokeWidth(5)}
          >
            <input
              type="radio"
              id="large"
              className="hidden"
              checked={strokeWidth === 5}
              onChange={() => setStrokeWidth(5)}
            />
            <FaMinus className="text-2xl" />
          </div>
        </div>

        <label htmlFor="fillStyle">Fill Style:</label>
        <div id="fillStyle" className="flex">
          <div
            className={`rounded-md p-1 m-2 ml-0 cursor-pointer ${
              fillStyle === "hachure"
                ? "bg-indigo-600/70 text-white"
                : "bg-gray-600/10"
            }`}
            onClick={() => setFillStyle("hachure")}
          >
            <input
              type="radio"
              id="hachure-fill"
              className="hidden"
              onChange={() => setFillStyle("hachure")}
              checked={fillStyle === "hachure"}
            />
            <MdOutlineRectangle className="text-2xl" />
          </div>
          <div
            className={`rounded-md p-1 m-2 ml-0 cursor-pointer ${
              fillStyle === "cross-hatch"
                ? "bg-indigo-600/70 text-white"
                : "bg-gray-600/10"
            }`}
            onClick={() => setFillStyle("cross-hatch")}
          >
            <input
              type="radio"
              id="cross-hatch-fill"
              className="hidden"
              onChange={() => setFillStyle("cross-hatch")}
              checked={fillStyle === "cross-hatch"}
            />
            <CgViewMonth className="text-2xl" />
          </div>
          <div
            className={`rounded-md p-1 m-2 ml-0 cursor-pointer ${
              fillStyle === "solid"
                ? "bg-indigo-600/70 text-white"
                : "bg-gray-600/10"
            }`}
            onClick={() => setFillStyle("solid")}
          >
            <input
              type="radio"
              id="solid-fill"
              className="hidden"
              onChange={() => setFillStyle("solid")}
              checked={fillStyle === "solid"}
            />
            <BiSolidRectangle className="text-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
