import { Joystick } from "react-joystick-component";
import styled from "styled-components";
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";
import { useControls } from "../../Context/ControlsProvider";
import { analogState } from "../../constants";

const JoystickContainer = styled.div`
  position: fixed;
  bottom: 50px;
  left: 50px;
  z-index: 1000;
  touch-action: none;
`;

const JumbButton = styled.button`
  background-color: black;
  color: white;
  opacity: 0.4;
  position: fixed;
  bottom: 75px;
  right: 40px;
  z-index: 1000;
  touch-action: none;
  padding: 5px 10px;
  font-size: basic;
  border-radius: 90px;
`;

export default function TouchControls() {
  const { updateControl } = useControls();

  const handleMove = (e: IJoystickUpdateEvent) => {
    if (!e.x || !e.y) return;

    updateControl("up", e.y > 0.01);
    updateControl("down", e.y < -0.01);
    updateControl("left", e.x < 0.01);
    updateControl("right", e.x > -0.01);

    analogState.x = e.x;
    analogState.z = e.y;
  };

  const handleStop = () => {
    updateControl("up", false);
    updateControl("down", false);
    updateControl("left", false);
    updateControl("right", false);
  };

  const handleJump = () => {
    updateControl("jump", true);
  };

  return (
    <>
      <JumbButton
        onClick={handleJump}
        onTouchStart={handleJump}
        onTouchEnd={(e) => e.preventDefault()}
      >
        Jump
      </JumbButton>
      <JoystickContainer>
        <Joystick
          size={100}
          baseColor="rgba(255, 255, 255, 0.2)"
          stickColor="rgba(255, 255, 255, 0.8)"
          move={handleMove}
          stop={handleStop}
        />
      </JoystickContainer>
    </>
  );
}
