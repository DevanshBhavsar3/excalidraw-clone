import { useState } from "react";
import { ElementType } from "../type";

export function useHistory(initialState: ElementType[]) {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const setState = (
    action: ElementType[] | ((current: ElementType[]) => ElementType[]),
    overwrite = false
  ) => {
    const newState =
      typeof action === "function" ? action(history[index]) : action;

    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedHistory = [...history].slice(0, index + 1);
      setHistory([...updatedHistory, newState]);
      setIndex((prevIndex) => prevIndex + 1);
    }
  };

  const undo = () => {
    if (index > 0) setIndex((prevIndex) => prevIndex - 1);
  };
  const redo = () => {
    if (index < history.length - 1) setIndex((prevIndex) => prevIndex + 1);
  };

  return {
    elements: history[index],
    setElements: setState,
    undo,
    redo,
  };
}
