import { ReactNode, useEffect, useMemo, useRef } from "react";
import { Controls } from "./constants";

import SocketProvider from "./Context/SocketProvider";
import { ControlsProvider } from "./Context/ControlsProvider";

import { GameStatesProvider } from "./Context/GameStatesProvider";
import { KeyboardControls } from "@react-three/drei";
import CoinsProvider from "./Context/CoinsProvider";

function InitLayout({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const map = useMemo(
    () => [
      { name: Controls.up, keys: ["KeyW", "ArrowUp"] },
      { name: Controls.down, keys: ["KeyS", "ArrowDown"] },
      { name: Controls.left, keys: ["KeyA", "ArrowLeft"] },
      { name: Controls.right, keys: ["KeyD", "ArrowRight"] },
      { name: Controls.jump, keys: ["Space"] },
    ],
    []
  );

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.style.width = `${window.innerWidth}px`;
        canvasRef.current.style.height = `${window.innerHeight}px`;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div ref={canvasRef} style={{ width: "100vw", height: "100vh" }}>
      <GameStatesProvider>
        <CoinsProvider>
          <SocketProvider>
            <KeyboardControls map={map}>
              <ControlsProvider>{children}</ControlsProvider>
            </KeyboardControls>
          </SocketProvider>
        </CoinsProvider>
      </GameStatesProvider>
    </div>
  );
}

export default InitLayout;
