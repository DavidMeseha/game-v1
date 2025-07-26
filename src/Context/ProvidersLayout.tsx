import { ReactNode, useEffect, useMemo, useRef } from "react";
import { Controls } from "../constants";
import { ControlsProvider } from "./ControlsProvider";
import { GameStatesProvider } from "./GameStatesProvider";
import { KeyboardControls } from "@react-three/drei";
import CoinsProvider from "./CoinsProvider";

export default function ProvidersLayout({ children }: { children: ReactNode }) {
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
    <main ref={canvasRef} style={{ width: "100vw", height: "100vh" }}>
      <GameStatesProvider>
        <CoinsProvider>
          <KeyboardControls map={map}>
            <ControlsProvider>{children}</ControlsProvider>
          </KeyboardControls>
        </CoinsProvider>
      </GameStatesProvider>
    </main>
  );
}
