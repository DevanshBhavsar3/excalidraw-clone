import Tippy from "@tippyjs/react";
import { BsArrow90DegLeft, BsArrow90DegRight, BsPlus } from "react-icons/bs";
import { RxDash } from "react-icons/rx";
import { roundArrow } from "tippy.js";
import "tippy.js/dist/svg-arrow.css";

type ToolbarType = {
  undo: () => void;
  redo: () => void;
  onZoom: (scale: number) => void;
  scale: number;
  setScale: (scale: number) => void;
};

export default function Toolbar({
  undo,
  redo,
  onZoom,
  scale,
  setScale,
}: ToolbarType) {
  return (
    <div>
      <div className="fixed backdrop-blur-md select-none bottom-5 left-5 h-[40px] border-2 rounded-lg flex items-center">
        <Tippy
          content="Zoom Out"
          className="bg-black text-white rounded-lg px-2 py-1"
          delay={[500, 0]}
          arrow={roundArrow}
        >
          <button
            className="text-xl px-3 hover:bg-black/10 rounded-l-md flex items-center h-full"
            onClick={() => onZoom(-0.1)}
          >
            <RxDash />
          </button>
        </Tippy>
        <Tippy
          content="Reset Zoom"
          className="bg-black text-white rounded-lg px-2 py-1"
          delay={[500, 0]}
          arrow={roundArrow}
        >
          <button
            className="text-sm font-sans px-6 h-full"
            onClick={() => setScale(1)}
          >
            {(scale * 100).toFixed(0)}%
          </button>
        </Tippy>
        <Tippy
          content="Zoom In"
          className="bg-black text-white rounded-lg px-2 py-1"
          delay={[500, 0]}
          arrow={roundArrow}
        >
          <button
            className="text-xl px-3 hover:bg-black/10 rounded-r-md flex items-center h-full"
            onClick={() => onZoom(0.1)}
          >
            <BsPlus />
          </button>
        </Tippy>
      </div>

      <div
        className="fixed backdrop-blur-md bottom-5 left-[200px] h-[40px] border-2 rounded-lg flex"
        id="undo-redo"
      >
        <Tippy
          content="Undo"
          className="bg-black text-white rounded-lg px-2 py-1"
          delay={[500, 0]}
          arrow={roundArrow}
        >
          <button
            className="text-xl px-3 hover:bg-black/10 rounded-l-md flex items-center"
            onClick={undo}
          >
            <BsArrow90DegLeft className="text-sm" />
          </button>
        </Tippy>
        <Tippy
          content="Redo"
          className="bg-black text-white rounded-lg px-2 py-1"
          delay={[500, 0]}
          arrow={roundArrow}
        >
          <button
            className="text-xl px-3 hover:bg-black/10 rounded-r-md flex items-center"
            onClick={redo}
          >
            <BsArrow90DegRight className="text-sm" />
          </button>
        </Tippy>
      </div>
    </div>
  );
}
