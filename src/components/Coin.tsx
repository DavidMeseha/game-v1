import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { Vector3 } from "three";

type Props = {
  position: Vector3 | [number, number, number];
  onCollect?: () => void;
};

function Coin({ position, onCollect }: Props) {
  const ref = useRef<Mesh>(null);

  // Rotate coin continuously
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={() => onCollect?.()}
      rotation={[100 * (Math.PI / 180), 0.2, 30 * (Math.PI / 180)]}
    >
      <cylinderGeometry args={[2, 2, 0.4, 32]} />
      <meshStandardMaterial color="gold" metalness={0.8} roughness={0.2} />
    </mesh>
  );
}
export default Coin;
