import { useFrame } from "@react-three/fiber";
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { MathUtils } from "three";
import { useEffect, useRef, useState } from "react";
import { gravity } from "../constants";
import { useGameControls } from "../hooks/useGameControls";
import { CharacterGroup } from "./CharacterGroup";
import { lerpAngle } from "../utils/characterUtils";
import * as THREE from "three";
import { useSocket } from "../Context/SocketProvider";
import { useControls } from "../Context/ControlsProvider";
import { useCoins } from "../Context/CoinsProvider";

export interface CharacterMovement {
  x: number;
  z: number;
}

export const CharacterController = () => {
  const { socket, handleCoinPick } = useSocket();
  const { WALK_SPEED, ROTATION_SPEED, CAMERA_TYPE } = useGameControls();
  const { controls } = useControls();
  const { coins } = useCoins();

  const rb = useRef<RapierRigidBody>(null);
  const container = useRef<THREE.Group>(null);
  const character = useRef<THREE.Group>(null);
  const cameraTarget = useRef<THREE.Group>(null);
  const cameraPosition = useRef<THREE.Group>(null);

  const vectors = useRef({
    v3: new THREE.Vector3(),
    cameraWorldPosition: new THREE.Vector3(),
    cameraLookAtWorldPosition: new THREE.Vector3(),
    cameraLookAt: new THREE.Vector3(),
  });
  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  const isClicking = useRef(false);
  const velocity = useRef(5);
  const [isJumping, setIsJumping] = useState(false);

  useEffect(() => {
    const handleJump = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isJumping) {
        setIsJumping(true);
      }
    };

    window.addEventListener("keydown", handleJump);
    return () => window.removeEventListener("keydown", handleJump);
  }, [isJumping]);

  const handleJumpPhysics = () => {
    if (!container.current) return;

    container.current.position.y += velocity.current * 0.1;
    velocity.current += gravity * 0.04;

    if (container.current.position.y <= 0) {
      container.current.position.y = 0;
      setIsJumping(false);
      velocity.current = 5;
    }
  };

  const calculateMovement = (mouse: {
    x: number;
    y: number;
  }): CharacterMovement => {
    const movement = { x: 0, z: 0 };

    if (controls.up) movement.z = 1;
    if (controls.down) movement.z = -1;
    if (controls.left) movement.x = 1;
    if (controls.right) movement.x = -1;

    if (isClicking.current) {
      if (Math.abs(mouse.x) > 0.1) movement.x = -mouse.x;
      movement.z = mouse.y + 0.4;
    }

    return movement;
  };

  useFrame(({ camera, mouse }) => {
    if (
      !character.current ||
      !container.current ||
      !cameraPosition.current ||
      !rb.current
    )
      return;

    if (controls.jump || isJumping) {
      handleJumpPhysics();
    }

    const movement = calculateMovement(mouse);
    const vel = rb.current.linvel();

    // Handle rotation and movement
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
    }

    if (movement.z !== 0) {
      const angle = rotationTarget.current + characterRotationTarget.current;
      vel.x = Math.sin(angle) * WALK_SPEED;
      vel.z = Math.cos(angle) * WALK_SPEED;
    }

    rb.current.setLinvel(vel, true);

    // Handle camera
    container.current.rotation.y = MathUtils.lerp(
      container.current.rotation.y,
      rotationTarget.current,
      0.1
    );

    cameraPosition.current.getWorldPosition(
      vectors.current.cameraWorldPosition
    );
    camera.position.lerp(vectors.current.cameraWorldPosition, 0.1);

    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(
        vectors.current.cameraLookAtWorldPosition
      );
      vectors.current.cameraLookAt.lerp(
        vectors.current.cameraLookAtWorldPosition,
        0.1
      );
      camera.lookAt(vectors.current.cameraLookAt);
    }

    const position = [
      vectors.current.v3.x,
      vectors.current.v3.y,
      vectors.current.v3.z,
    ];

    coins.forEach((coin) => {
      if (
        Math.abs(coin[0] - position[0]) < 5 &&
        Math.abs(coin[2] - position[2]) < 5
      ) {
        console.log("Coin picked:", coin);
        handleCoinPick(coin);
      }
    });

    // Emit position updates
    if (!socket) return;
    if (
      controls.up ||
      controls.down ||
      controls.right ||
      controls.left ||
      isJumping ||
      isClicking.current
    ) {
      container.current.getWorldPosition(vectors.current.v3);
      socket.emit("move", {
        position,
        rotation: container.current.rotation.y,
      });
    }
  });

  return (
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
      <CuboidCollider args={[4, 0, 4]} />
    </RigidBody>
  );
};
