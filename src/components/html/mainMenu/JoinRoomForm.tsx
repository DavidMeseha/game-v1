import { useEffect, useRef } from "react";
import { useGameStates } from "../../../Context/GameStatesProvider";
import socketService from "../../../services/socket";

export default function JoinRoomForm() {
  const {
    setMainMenuState,
    setIsLoading,
    setIsSpectator,
    setId,
    setRoom,
    clearError,
    name,
  } = useGameStates();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleJoinRoom = (isSpectator: boolean) => {
    setIsLoading("Joining room...");
    socketService.emitJoinRoom({
      roomName: inputRef.current?.value ?? "",
      isSpectator,
      name,
    });
  };

  const handleCancelJoining = () => {
    setMainMenuState("main");
    clearError();
  };

  useEffect(() => {
    socketService.on(
      "joined",
      ({
        isSpectator,
        id,
        roomId,
      }: {
        isSpectator: boolean;
        id: string;
        roomId: string;
      }) => {
        setIsLoading(null);
        setId(id);
        setRoom(roomId);
        setIsSpectator(isSpectator);
        setMainMenuState("waiting");
        clearError();
      }
    );
  }, []);

  return (
    <>
      <h3> Enter room code to join</h3>
      <input
        type="text"
        ref={inputRef}
        className="w-full text-center"
        onChange={clearError}
      />
      <div>
        <button className="mt-1 me-1" onClick={handleCancelJoining}>
          Cancel
        </button>
        <button className="mt-1 me-1" onClick={() => handleJoinRoom(false)}>
          Join
        </button>
        <button className="mt-1" onClick={() => handleJoinRoom(true)}>
          Spectate
        </button>
      </div>
    </>
  );
}
