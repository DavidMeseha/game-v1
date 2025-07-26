import { useGameStates } from "../../../Context/GameStatesProvider";
import MenuOptions from "./MenuOptions";
import CreatedRoomScreen from "./CreatedRoomScreen";
import JoinRoomForm from "./JoinRoomForm";
import WaitingScreen from "./WaitingScreen";
import NameForm from "./NameForm";
import ReconnectScreen from "./ReconnectScreen";

export default function GameMainMenu() {
  const { mainMenuState, isLoading, error } = useGameStates();

  return (
    <div className="initial-screen">
      <h1>Welcome to Idle-Idle!</h1>
      <div className="initial-menu mt-1">
        {mainMenuState === "main" ? (
          <MenuOptions />
        ) : (
          <div className="flex-center flex-col mt-1">
            {isLoading ? (
              <p className="loading-text">{isLoading}</p>
            ) : (
              <>
                {mainMenuState === "reconnect" && <ReconnectScreen />}
                {mainMenuState === "naming" && <NameForm />}
                {mainMenuState === "create" && <CreatedRoomScreen />}
                {mainMenuState === "join" && <JoinRoomForm />}
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
