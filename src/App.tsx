import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { CharacterController } from "./components/CharacterController";
import { useSocket } from "./Context/SocketProvider";
import OtherPlayer from "./components/OtherPlayer";

useGLTF.preload("./non.glb");

function App() {
  const obj = useGLTF("./non.glb");
  const { players, id } = useSocket();

  return (
    <>
      <CharacterController />
      {players.map((player) => {
        if (player.id !== id)
          return (
            <OtherPlayer
              position={player.position}
              rotation={player.rotation}
              key={player.id}
            />
          );
      })}
      <group scale={0.2} position={[-6, -7, -20]}>
        <RigidBody type="fixed" colliders="trimesh">
          <primitive object={obj.scene} scale={20} />
        </RigidBody>
      </group>
    </>
  );
}

export default App;
