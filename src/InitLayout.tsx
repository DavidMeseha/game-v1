import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  KeyboardControls,
  // OrbitControls,
} from "@react-three/drei";
import { Controls } from "./constants";
import { Physics } from "@react-three/rapier";
import SocketProvider from "./Context/SocketProvider";
import TouchControls from "./components/TouchControls";
import { ControlsProvider } from "./Context/ControlsProvider";
import ControlsInstructions from "./components/ControlsInstructions";

function InitLayout({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice] = useState("ontouchstart" in window);

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
      <SocketProvider>
        <KeyboardControls map={map}>
          <ControlsProvider>
            <ControlsInstructions />
            {isTouchDevice && <TouchControls />}

            <Canvas>
              <Environment preset="sunset" />
              {/* <OrbitControls /> */}
              <Physics gravity={[0, -90, 0]} timeStep="vary">
                {children}
              </Physics>
            </Canvas>
          </ControlsProvider>
        </KeyboardControls>
      </SocketProvider>
    </div>
  );
}

export default InitLayout;
