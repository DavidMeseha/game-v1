import { Physics, RigidBody } from "@react-three/rapier";
import { CharacterController } from "./CharacterController";
import OtherPlayer from "./OtherPlayer";
import Coins from "./Coins";
import { useGameStates } from "../../Context/GameStatesProvider";
import { useGLTF } from "@react-three/drei";

type Props = {
  object: ReturnType<typeof useGLTF>;
};

export default function GameEnvironment({ object }: Props) {
  const { id, players, isSpectator, gameState } = useGameStates();

  return (
    <Physics gravity={[0, -90, 0]} timeStep="vary">
      {gameState === "playing" && (
        <>
          {!isSpectator && <CharacterController />}
          {players.map((player) => {
            if (player.id === id || player.isSpectator) return;

            return (
              <OtherPlayer
                position={player.position}
                rotation={player.rotation}
                name={player.name}
                key={player.id}
              />
            );
          })}
        </>
      )}

      <Coins />

      {/* Sceen Object */}
      <group scale={0.2} position={[-6, -7, -20]}>
        <RigidBody type="fixed" colliders="trimesh">
          <primitive
            object={Array.isArray(object) ? object[0].scene : object.scene}
            scale={20}
          />
        </RigidBody>
      </group>
    </Physics>
  );
}
