import { useGameStates } from "../../Context/GameStatesProvider";
import { useSocket } from "../../Context/SocketProvider";

export default function WaitingScreen() {
  const { handleRoomCancel } = useSocket();
  const { playersCount } = useGameStates();

  return (
    <>
      <p>{playersCount} players in room</p>
      <p>Waiting for players to join...</p>
      <button className="mt-1" onClick={handleRoomCancel}>
        Cancel
      </button>
    </>
  );
}
