import { createContext, useContext, ReactNode } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "../constants";

interface Controls {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
}

interface TouchPadContextType {
  controls: Controls;
  updateControl: (key: keyof Controls, value: boolean) => void;
}

const ControlsContext = createContext<TouchPadContextType | null>(null);

export function ControlsProvider({ children }: { children: ReactNode }) {
  const controls: Controls = {
    up: useKeyboardControls((state) => state[Controls.up]),
    down: useKeyboardControls((state) => state[Controls.down]),
    left: useKeyboardControls((state) => state[Controls.left]),
    right: useKeyboardControls((state) => state[Controls.right]),
    jump: useKeyboardControls((state) => state[Controls.jump]),
  };

  const updateControl = (key: keyof Controls, value: boolean) => {
    controls[key] = value;
  };

  return (
    <ControlsContext.Provider value={{ controls, updateControl }}>
      {children}
    </ControlsContext.Provider>
  );
}

export const useControls = () => {
  const context = useContext(ControlsContext);
  if (!context) {
    throw new Error("useControls must be used within a ControlsProvider");
  }
  return context;
};
