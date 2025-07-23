import { useEffect, useRef } from "react";
import { useGameStates } from "../../Context/GameStatesProvider";
import { useSocket } from "../../Context/SocketProvider";

export default function CreatedRoomScreen() {
  const { handleRoomCancel, handleStartGame } = useSocket();
  const { playersCount, room, mainMenuState } = useGameStates();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mainMenuState === "create" && inputRef.current && room)
      inputRef.current.value = room;
  }, [mainMenuState, room]);

  return (
    <>
      <p>{playersCount} players in room</p>
      <h3>Room Joining Code.</h3>
      <input
        type="text"
        ref={inputRef}
        className="w-full text-center"
        onKeyDown={(e) => e.preventDefault()}
      />
      <div>
        <button className="mt-1 me-1" onClick={handleStartGame}>
          Start
        </button>
        <button className="mt-1" onClick={handleRoomCancel}>
          Cancel
        </button>
      </div>
    </>
  );
}
