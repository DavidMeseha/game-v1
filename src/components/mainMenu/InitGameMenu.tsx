import { useSocket } from "../../Context/SocketProvider";
import { useState } from "react";
import { useGameStates } from "../../Context/GameStatesProvider";
import MenuOptions from "./MenuOptions";
import CreatedRoomScreen from "./CreatedRoomScreen";
import JoinRoomForm from "./JoinRoomForm";
import WaitingScreen from "./WaitingScreen";
import NameForm from "./NameForm";

export default function InitGameMenu() {
  const { error } = useSocket();
  const { mainMenuState, isLoading } = useGameStates();
  const [name, setName] = useState("");

  return (
    <div className="initial-screen">
      <h1>Welcome to Idle-Idle!</h1>
      <h3 className="mt-1">Attache to a room</h3>
      <div className="initial-menu mt-1">
        {mainMenuState === "main" ? (
          <MenuOptions name={name} />
        ) : (
          <div className="flex-center flex-col mt-1">
            {isLoading ? (
              <p className="loading-text">{isLoading}</p>
            ) : (
              <>
                {mainMenuState === "naming" && (
                  <NameForm setName={(n) => setName(n)} />
                )}
                {mainMenuState === "create" && <CreatedRoomScreen />}
                {mainMenuState === "join" && <JoinRoomForm name={name} />}
                {mainMenuState === "waiting" && <WaitingScreen />}
              </>
            )}
          </div>
        )}
      </div>
      <p className="error-text">{error}</p>
    </div>
  );
}
