import { useEffect, useRef, useState } from "react";
import { useGameStates } from "../../../Context/GameStatesProvider";
import socketService from "../../../services/socket";
import { Check, Copy } from "lucide-react";

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
  const [coppied, setCopy] = useState(false);

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

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(room);
      setCopy(true);

      setTimeout(() => {
        setCopy(false);
      }, 1000);
    }
  };

  return (
    <>
      <p>{playersCount} players in room</p>
      <h3>Room Joining Code.</h3>
      <div className="code-display-area">
        <input
          type="text"
          ref={inputRef}
          className="w-full text-center"
          onKeyDown={(e) => e.preventDefault()}
        />
        {coppied ? (
          <Check className="copy-icon" />
        ) : (
          <Copy className="copy-icon" onClick={handleCopy} />
        )}
      </div>
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
