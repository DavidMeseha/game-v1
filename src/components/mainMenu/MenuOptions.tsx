import { Eye, JoystickIcon, Network } from "lucide-react";
import { useSocket } from "../../Context/SocketProvider";
import { useGameStates } from "../../Context/GameStatesProvider";

export default function MenuOptions({ name }: { name: string }) {
  const { handleCreateRoom, clearError } = useSocket();
  const { setMainMenuState } = useGameStates();

  const handleJoinClick = () => {
    setMainMenuState("join");
    clearError();
  };
  return (
    <div className="menu-options">
      <button onClick={handleJoinClick}>
        <JoystickIcon size={50} />
        <p className="mt-1">Join Room</p>
      </button>
      <button onClick={() => handleCreateRoom(false, name)}>
        <Network size={50} />
        <p className="mt-1">Create Room</p>
      </button>
      <button onClick={() => handleCreateRoom(true, name)}>
        <Eye size={50} />
        <p className="mt-1">Create Spectate</p>
      </button>
    </div>
  );
}
