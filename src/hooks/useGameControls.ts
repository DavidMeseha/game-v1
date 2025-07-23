import { useControls } from "leva";
import { degToRad } from "three/src/math/MathUtils.js";

export const useGameControls = () => {
  const { WALK_SPEED, ROTATION_SPEED, CAMERA_TYPE } = useControls(
    "Character Control",
    {
      WALK_SPEED: { value: 25, min: 10, max: 25, step: 5 },
      ROTATION_SPEED: {
        value: degToRad(2),
        min: degToRad(1),
        max: degToRad(2),
        step: degToRad(1),
      },
      CAMERA_TYPE: {
        options: {
          firstPerson: 3,
          secondPerson: -4,
          thirdPerson: -8,
        },
      },
    }
  );

  return {
    WALK_SPEED,
    ROTATION_SPEED,
    CAMERA_TYPE,
  };
};
