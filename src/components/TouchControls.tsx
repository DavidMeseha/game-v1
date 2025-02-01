import { Joystick } from "react-joystick-component";
import styled from "styled-components";
import { IJoystickUpdateEvent } from "react-joystick-component/build/lib/Joystick";
import { useControls } from "../Context/ControlsProvider";

const JoystickContainer = styled.div`
  position: fixed;
  bottom: 50px;
  left: 50px;
  z-index: 1000;
  touch-action: none;
`;

export default function TouchControls() {
  const { updateControl } = useControls();

  const handleMove = (e: IJoystickUpdateEvent) => {
    if (!e.x || !e.y) return;

    updateControl("up", e.y > 0.3);
    updateControl("down", e.y < -0.3);
    updateControl("left", e.x < -0.3);
    updateControl("right", e.x > 0.3);
  };

  const handleStop = () => {
    updateControl("up", false);
    updateControl("down", false);
    updateControl("left", false);
    updateControl("right", false);
  };

  return (
    <JoystickContainer>
      <Joystick
        size={100}
        baseColor="rgba(255, 255, 255, 0.2)"
        stickColor="rgba(255, 255, 255, 0.8)"
        move={handleMove}
        stop={handleStop}
      />
    </JoystickContainer>
  );
}
