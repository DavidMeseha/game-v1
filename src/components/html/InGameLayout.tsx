import { LogOut } from "lucide-react";
import { isTouchScreen } from "../../utils/isTouchSceen";
import TouchControls from "./TouchControls";
import ControlsInstructions from "./ControlsInstructions";
import { useGameStates } from "../../Context/GameStatesProvider";
import socketService from "../../services/socket";

export default function InGameLayout() {
  const {
    id,
    players,
    setMainMenuState,
    setGameState,
    setIsLoading,
    setRoom,
    setPlayers,
    setIsSpectator,
    clearError,
  } = useGameStates();

  const handleLeaveRoom = () => {
    socketService.emitLeaveRoom();
    setMainMenuState("naming");
    setGameState("prepering");
    setIsLoading(null);
    setRoom("");
    setPlayers([]);
    setIsSpectator(false);
    clearError();
  };

  return (
    <>
      <button className="in-game-leave-button" onClick={handleLeaveRoom}>
        <LogOut size={25} />
      </button>

      {isTouchScreen ? <TouchControls /> : <ControlsInstructions />}

      <div className="score-board">
        {players.map((player) => {
          if (player.isSpectator) return;
          return (
            <div className="item" key={player.id}>
              <div>{player.id === id ? "You" : player.name}</div>
              <div>{player.coins}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}
