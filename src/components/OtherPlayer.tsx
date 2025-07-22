import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, MathUtils, Vector3 } from "three";
import { CharacterGroup } from "./CharacterGroup";

interface OtherPlayerProps {
  position: [number, number, number];
  rotation: number;
  name: string;
}

export default function OtherPlayer({
  position,
  rotation,
  name,
}: OtherPlayerProps) {
  const playerRef = useRef<Group>(null);
  const characterRef = useRef<Group>(null);
  const targetPosition = useRef(new Vector3());

  useEffect(() => {
    targetPosition.current.set(...position);
  }, [position]);

  useFrame(() => {
    if (!playerRef.current || !characterRef.current) return;

    playerRef.current.position.lerp(targetPosition.current, 0.1);
    characterRef.current.rotation.y = MathUtils.lerp(
      characterRef.current.rotation.y,
      rotation,
      0.1
    );
  });

  return (
    <group ref={playerRef}>
      <CharacterGroup ref={characterRef} name={name} color="green" />
    </group>
  );
}
