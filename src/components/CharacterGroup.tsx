import { forwardRef } from "react";
import { Group, Object3DEventMap } from "three";

export const CharacterGroup = forwardRef(
  ({ color }: { color: string }, ref: React.Ref<Group<Object3DEventMap>>) => {
    return (
      <group ref={ref}>
        <mesh>
          <boxGeometry args={[4, 12, 4]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    );
  }
);