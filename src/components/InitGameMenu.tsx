import { Eye, JoystickIcon, Network } from "lucide-react";
import { useSocket } from "../Context/SocketProvider";
import { useEffect, useRef, useState } from 'react';
import { useGameStates } from "../Context/GameStatesProvider";

export default function InitGameMenu() {
  const {
    handleCreateRoom,
    handleJoinRoom,
    handleRoomCancel,
    handleStartGame,
    error,
    clearError,
  } = useSocket();
  const { room, mainMenuState, setMainMenuState, playersCount } =
    useGameStates();
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");

  const handleJoinClick = () => {
    setMainMenuState("join");
    clearError();
  };

  const handleCancelJoining = () => {
    setMainMenuState("main");
    clearError();
  };

  useEffect(() => {
    if (mainMenuState === "create" && inputRef.current && room)
      inputRef.current.value = room;
  }, [mainMenuState, room]);

  return (
    <div className="initial-screen">
      <h1>Welcome to Idle-Idle!</h1>
      <h3 className="mt-1">Attache to a room</h3>
      <div className="initial-menu mt-1">
        {mainMenuState === "main" ? (
          <>
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
          </>
        ) : (
          <div className="flex-center flex-col mt-1">
            {mainMenuState === "create" && (
              <>
                <p>{playersCount} players in room</p>
                <h3>Room Joining Code.</h3>
                <input
                  type="text"
                  ref={inputRef}
                  className="w-auto text-center"
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
            )}
            {mainMenuState === "join" && (
              <>
                <h3> Enter room code to join</h3>
                <input
                  type="text"
                  ref={inputRef}
                  className="w-auto text-center"
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
            )}
            {mainMenuState === "waiting" && (
              <>
                <p>{playersCount} players in room</p>
                <p>Waiting for players to join...</p>
                <button className="mt-1" onClick={handleRoomCancel}>
                  Cancel
                </button>
              </>
            )}
            {mainMenuState === "naming" && (
              <>
                <p>Your Name.</p>
                <input
                  type="text"
                  value={name}
                  className="w-auto text-center"
                  onChange={(e) => setName(e.target.value)}
                />
                <button
                  className="mt-1"
                  onClick={() => setMainMenuState("main")}
                >
                  Proceed
                </button>
              </>
            )}
          </div>
        )}
      </div>
      <p className="error-text">{error}</p>
    </div>
  );
}
