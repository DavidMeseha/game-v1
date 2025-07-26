import { useGLTF } from "@react-three/drei";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useGameStates } from "./Context/GameStatesProvider";
import InGameLayout from "./components/html/InGameLayout";
import GameMainMenu from "./components/html/mainMenu/GameMainMenu";
import GameEnvironment from "./components/canvas/GameEnvironment";

useGLTF.preload("./non.glb");

export default function GameEntryPoint() {
  const obj = useGLTF("./non.glb");
  const { gameState, isSpectator } = useGameStates();

  return (
    <>
      {gameState === "playing" ? <InGameLayout /> : <GameMainMenu />}

      <Canvas>
        <Environment preset="sunset" />
        {isSpectator && <OrbitControls />}
        <GameEnvironment object={obj} />
      </Canvas>
    </>
  );
}
