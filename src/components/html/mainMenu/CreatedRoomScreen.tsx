import { useEffect, useRef } from "react";
import { useGameStates } from "../../../Context/GameStatesProvider";
import socketService from "../../../services/socket";

export default function CreatedRoomScreen() {
  const {
    playersCount,
    room,
    setMainMenuState,
    setRoom,
    setPlayersCount,
    clearError,
  } = useGameStates();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && room) inputRef.current.value = room;
  }, [room]);

  const handleStartGame = () => socketService.emitStartGame();
  const handleRoomCancel = () => {
    socketService.emitCancelRoom();
    setMainMenuState("main");
    setRoom("");
    clearError();
    setPlayersCount(1);
  };
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
