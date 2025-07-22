import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { CharacterController } from "./components/CharacterController";
import { useSocket } from "./Context/SocketProvider";
import OtherPlayer from "./components/OtherPlayer";
import ControlsInstructions from "./components/ControlsInstructions";
import InitGameMenu from "./components/InitGameMenu";
import { isTouchScreen } from "./utils/isTouchSceen";
import { Physics } from "@react-three/rapier";
import TouchControls from "./components/TouchControls";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useGameStates } from "./Context/GameStatesProvider";
import Coins from "./components/Coins";

useGLTF.preload("./non.glb");

function App() {
  const obj = useGLTF("./non.glb");
  const { players, id } = useSocket();
  const { gameState } = useGameStates();

  return (
    <>
      {isTouchScreen ? <TouchControls /> : <ControlsInstructions />}
      {gameState !== "playing" && <InitGameMenu />}
      {gameState === "playing" && (
        <div className="score-board">
          {players.map((player) => {
            if (player.id === id)
              return (
                <div className="item">
                  <div>You</div>
                  <div>{player.coins}</div>
                </div>
              );
            return (
              <div className="item">
                <div>{player.id}</div>
                <div>{player.coins}</div>
              </div>
            );
          })}
        </div>
      )}

      <Canvas>
        <Environment preset="sunset" />
        <OrbitControls />
        <Physics gravity={[0, -90, 0]} timeStep="vary">
          {gameState === "playing" && <CharacterController />}
          {players.map((player) => {
            if (player.id !== id)
              return (
                <OtherPlayer
                  position={player.position}
                  rotation={player.rotation}
                  name={player.id}
                  key={player.id}
                />
              );
          })}
          <Coins />
          <group scale={0.2} position={[-6, -7, -20]}>
            <RigidBody type="fixed" colliders="trimesh">
              <primitive object={obj.scene} scale={20} />
            </RigidBody>
          </group>
        </Physics>
      </Canvas>
    </>
  );
}

export default App;
