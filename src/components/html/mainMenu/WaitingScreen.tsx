import { useGameStates } from "../../../Context/GameStatesProvider";
import socketService from "../../../services/socket";

export default function WaitingScreen() {
  const { playersCount, setMainMenuState } = useGameStates();

  const handleRoomJoinCancel = () => {
    socketService.emitLeaveRoom();
    setMainMenuState("main");
  };

  return (
    <>
      <p>{playersCount} players in room</p>
      <p>Waiting for players to join...</p>
      <button className="mt-1" onClick={handleRoomJoinCancel}>
        Cancel
      </button>
    </>
  );
}
