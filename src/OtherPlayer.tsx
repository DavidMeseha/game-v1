import { RigidBody } from "@react-three/rapier";
import { CharacterGroup } from "./CharacterController";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Object3DEventMap, MathUtils } from "three";
import { Vector3 } from "three";

type Props = {
  position: [number, number, number];
  rotation: number;
};

export default function OtherPlayer({ position, rotation }: Props) {
  const player = useRef<Group<Object3DEventMap>>(null);
  const character = useRef<Group<Object3DEventMap>>(null);
  const v3 = useRef(new Vector3());

  useFrame(() => {
    if (!player.current || !character.current) return;
    v3.current.x = position[0];
    v3.current.y = position[1];
    v3.current.z = position[2];
    player.current.position.lerp(v3.current, 0.1);
    character.current.rotation.y = MathUtils.lerp(
      player.current.rotation.y,
      rotation,
      0.1
    );
    // player.current.position.set(v3.current.x, v3.current.y, v3.current.z);
  });

  return (
    <group ref={player}>
      <RigidBody colliders="cuboid" lockRotations>
        <CharacterGroup ref={character} color="green" />
      </RigidBody>
    </group>
  );
}
