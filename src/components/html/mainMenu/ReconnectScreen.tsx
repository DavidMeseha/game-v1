import { useGameStates } from "../../../Context/GameStatesProvider";
import {
  clearPlayerReconnectionData,
  getPlayerReconnectionData,
} from "../../../services/localStorage";
import socketService from "../../../services/socket";

export default function ReconnectScreen() {
  const { setIsLoading, setMainMenuState } = useGameStates();

  const handleReconnect = () => {
    const reconnectionData = getPlayerReconnectionData();
    if (reconnectionData) {
      socketService.emitReconnect({ ...reconnectionData });
      setIsLoading("Reconnecting...");
    }
  };

  const handleCancel = () => {
    setMainMenuState("naming");
    clearPlayerReconnectionData();
  };

  return (
    <>
      <p>Reconnect ?</p>
      <div className="flex-center">
        <button className="mt-1 me-1" onClick={handleReconnect}>
          Reconnect
        </button>
        <button className="mt-1" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </>
  );
}
