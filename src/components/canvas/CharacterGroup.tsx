import { Billboard, Text } from "@react-three/drei";
import { forwardRef } from "react";
import { Group, Object3DEventMap } from "three";

export const CharacterGroup = forwardRef(
  (
    { color, name }: { color: string; name?: string },
    ref: React.Ref<Group<Object3DEventMap>>
  ) => {
    return (
      <>
        <group ref={ref}>
          <mesh>
            <boxGeometry args={[4, 12, 4]} />
            <meshStandardMaterial color={color} />
          </mesh>

          {name && (
            <Billboard>
              <Text
                position={[0, 8, 0]}
                fontSize={1}
                color="#fff"
                anchorX="center"
              >
                {name}
              </Text>
            </Billboard>
          )}
        </group>
      </>
    );
  }
);
