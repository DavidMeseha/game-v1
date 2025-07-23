import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { CharacterController } from "./components/CharacterController";
import { useSocket } from "./Context/SocketProvider";
import OtherPlayer from "./components/OtherPlayer";
import ControlsInstructions from "./components/ControlsInstructions";
import InitGameMenu from "./components/mainMenu/InitGameMenu";
import { isTouchScreen } from "./utils/isTouchSceen";
import { Physics } from "@react-three/rapier";
import TouchControls from "./components/TouchControls";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useGameStates } from "./Context/GameStatesProvider";
import Coins from "./components/Coins";
import { LogOut } from "lucide-react";

useGLTF.preload("./non.glb");

function App() {
  const obj = useGLTF("./non.glb");
  const { players, id, handleLeaveRoom } = useSocket();
  const { gameState, isSpectator } = useGameStates();

  return (
    <>
      {gameState === "playing" ? (
        <>
          <button className="in-game-leave-button" onClick={handleLeaveRoom}>
            <LogOut size={25} />
          </button>

          {isTouchScreen ? <TouchControls /> : <ControlsInstructions />}

          <div className="score-board">
            {players.map((player) => {
              if (player.isSpectator) return;
              return (
                <div className="item" key={player.id}>
                  <div>{player.id === id ? "You" : player.name}</div>
                  <div>{player.coins}</div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <InitGameMenu />
      )}

      <Canvas>
        <Environment preset="sunset" />
        {isSpectator && <OrbitControls />}
        <Physics gravity={[0, -90, 0]} timeStep="vary">
          {gameState === "playing" && !isSpectator && <CharacterController />}
          {players.map((player) => {
            if (player.id !== id && !player.isSpectator)
              return (
                <OtherPlayer
                  position={player.position}
                  rotation={player.rotation}
                  name={player.name}
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
