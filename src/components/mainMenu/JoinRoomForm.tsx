import { useRef } from "react";
import { useGameStates } from "../../Context/GameStatesProvider";
import { useSocket } from "../../Context/SocketProvider";

export default function JoinRoomForm({ name }: { name: string }) {
  const { handleJoinRoom, clearError } = useSocket();
  const { setMainMenuState } = useGameStates();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCancelJoining = () => {
    setMainMenuState("main");
    clearError();
  };
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
        <button
          className="mt-1 me-1"
          onClick={() =>
            handleJoinRoom(inputRef.current?.value ?? "", false, name)
          }
        >
          Join
        </button>
        <button
          className="mt-1"
          onClick={() =>
            handleJoinRoom(inputRef.current?.value ?? "", true, name)
          }
        >
          Spectate
        </button>
      </div>
    </>
  );
}
