import { Eye, JoystickIcon, Network } from "lucide-react";
import { useGameStates } from "../../../Context/GameStatesProvider";
import socketService from "../../../services/socket";
import { useEffect } from "react";

export default function MenuOptions() {
  const {
    setMainMenuState,
    setIsLoading,
    setIsSpectator,
    setPlayersCount,
    setRoom,
    name,
    clearError,
  } = useGameStates();

  const handleJoinClick = () => {
    setMainMenuState("join");
    clearError();
  };

  const handleCreateRoom = (isSpectator: boolean) => {
    setIsLoading("Creating room...");
    socketService.emitCreateRoom({ isSpectator, name });
    clearError();
  };

  useEffect(() => {
    const handleCreatedRoom = ({
      room,
      isSpectator,
    }: {
      room: string;
      isSpectator: boolean;
    }) => {
      setIsLoading(null);
      setIsSpectator(isSpectator);
      setMainMenuState("create");
      setPlayersCount(1);
      setRoom(room);
    };

    socketService.on("created", handleCreatedRoom);

    return () => {
      socketService.off("created", handleCreatedRoom);
    };
  }, []);

  return (
    <div className="menu-options">
      <button onClick={handleJoinClick}>
        <JoystickIcon size={50} />
        <p className="mt-1">Join Room</p>
      </button>
      <button onClick={() => handleCreateRoom(false)}>
        <Network size={50} />
        <p className="mt-1">Create Room</p>
      </button>
      <button onClick={() => handleCreateRoom(true)}>
        <Eye size={50} />
        <p className="mt-1">Create Spectate</p>
      </button>
    </div>
  );
}
