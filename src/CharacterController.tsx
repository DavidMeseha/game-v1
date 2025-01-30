import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useControls } from "leva";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Group, MathUtils, Object3DEventMap, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { Controls, gravity } from "./constants";
import { socket } from "./Context/SocketProvider";

const normalizeAngle = (angle: number) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

const lerpAngle = (start: number, end: number, t: number) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  if (Math.abs(end - start) > Math.PI) {
    if (end > start) {
      start += 2 * Math.PI;
    } else {
      end += 2 * Math.PI;
    }
  }

  return normalizeAngle(start + (end - start) * t);
};

export const CharacterController = () => {
  const { WALK_SPEED, ROTATION_SPEED, CAMERA_TYPE } = useControls(
    "Character Control",
    {
      WALK_SPEED: { value: 10, min: 10, max: 20, step: 1 },
      ROTATION_SPEED: {
        value: degToRad(1),
        min: degToRad(1),
        max: degToRad(5),
        step: degToRad(0.1),
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

  const upPressed = useKeyboardControls((state) => state[Controls.up]);
  const downPressed = useKeyboardControls((state) => state[Controls.down]);
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
  // const shootPressed = useKeyboardControls((state) => state[Controls.shoot]);
  // const escPressed = useKeyboardControls((state) => state[Controls.escape]);

  const rb = useRef<RapierRigidBody>(null);
  const container = useRef<Group<Object3DEventMap>>(null);
  const character = useRef<Group<Object3DEventMap>>(null);
  const v3 = useRef(new Vector3());

  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  const cameraTarget = useRef<Group<Object3DEventMap>>(null);
  const cameraPosition = useRef<Group<Object3DEventMap>>(null);
  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());
  const isClicking = useRef(false);
  const velocity = useRef(5);
  const [isJumping, setIsJumping] = useState(false);
  const [temp, setTemp] = useState(true);

  useEffect(() => {
    const onMouseDown = () => {
      isClicking.current = true;
    };
    const onMouseUp = () => {
      isClicking.current = false;
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    // touch
    document.addEventListener("touchstart", onMouseDown);
    document.addEventListener("touchend", onMouseUp);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchstart", onMouseDown);
      document.removeEventListener("touchend", onMouseUp);
    };
  }, []);

  useEffect(() => {
    const handleJump = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isJumping) {
        setIsJumping(true);
      }
    };

    window.addEventListener("keydown", handleJump);
    return () => {
      window.removeEventListener("keydown", handleJump);
    };
  }, [isJumping]);

  useFrame(({ camera, mouse }) => {
    if (
      !character.current ||
      !container.current ||
      !cameraPosition.current ||
      !rb.current
    )
      return;

    if (jumpPressed) setIsJumping(true);

    if (isJumping) {
      container.current.position.y += velocity.current * 0.1;
      velocity.current += gravity * 0.04;

      if (container.current.position.y <= 0) {
        container.current.position.y = 0;
        setIsJumping(false);
        velocity.current = 5;
      }
    }

    const vel = rb.current.linvel();

    const movement = {
      x: 0,
      z: 0,
    };

    if (upPressed) {
      movement.z = 1;
    }
    if (downPressed) {
      movement.z = -1;
    }

    const speed = WALK_SPEED;

    if (isClicking.current) {
      // console.log("clicking", mouse.x, mouse.y);
      if (Math.abs(mouse.x) > 0.1) {
        movement.x = -mouse.x;
      }
      movement.z = mouse.y + 0.4;
    }

    if (leftPressed) {
      movement.x = 1;
    }
    if (rightPressed) {
      movement.x = -1;
    }

    if (movement.x !== 0) {
      rotationTarget.current += ROTATION_SPEED * movement.x;
    }

    if (movement.x !== 0 || movement.z !== 0) {
      characterRotationTarget.current = Math.atan2(movement.x, movement.z);

      character.current.rotation.y = lerpAngle(
        character.current.rotation.y,
        characterRotationTarget.current,
        0.1
      );

      if (movement.z !== 0) {
        vel.x =
          Math.sin(rotationTarget.current + characterRotationTarget.current) *
          speed;
        vel.z =
          Math.cos(rotationTarget.current + characterRotationTarget.current) *
          speed;
      }
    }

    rb.current.setLinvel(vel, true);

    // CAMERA
    container.current.rotation.y = MathUtils.lerp(
      container.current.rotation.y,
      rotationTarget.current,
      0.1
    );

    cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
    camera.position.lerp(cameraWorldPosition.current, 0.1);
    if (temp) {
      setTemp(false);
    }

    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);

      camera.lookAt(cameraLookAt.current);
    }

    container.current.getWorldPosition(v3.current);

    if (upPressed || downPressed || rightPressed || leftPressed) {
      socket.emit("move", {
        position: [v3.current.x, v3.current.y, v3.current.z],
        rotation: container.current.rotation.y,
      });
    }
  });

  return (
    <>
      <RigidBody colliders="cuboid" lockRotations ref={rb}>
        <group ref={container} position={[0, 0, 0]}>
          <group ref={cameraTarget} position-z={20} />
          <group
            ref={cameraPosition}
            position-y={8}
            position-z={CAMERA_TYPE ?? 3}
          />
          <CharacterGroup ref={character} color="white" />
        </group>
        {/* <CapsuleCollider args={[0.1, 0]} /> */}
        <CuboidCollider args={[4, 0, 4]} />
      </RigidBody>
    </>
  );
};

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
