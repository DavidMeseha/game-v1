import { createContext, useContext, ReactNode, useState } from "react";

type MenuStatus = "join" | "create" | "main" | "waiting";
type GameStatus = "prepering" | "playing" | "ended";

type ProvidedValues = {
  room: string | null;
  setRoom: React.Dispatch<React.SetStateAction<string | null>>;
  mainMenuState: MenuStatus;
  setMainMenuState: React.Dispatch<React.SetStateAction<MenuStatus>>;
  isRuning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  gameState: GameStatus;
  setGameState: React.Dispatch<React.SetStateAction<GameStatus>>;
  playersCount: number;
  setPlayersCount: React.Dispatch<React.SetStateAction<number>>;
};

const GameStatesContext = createContext<ProvidedValues | null>(null);

export function GameStatesProvider({ children }: { children: ReactNode }) {
  const [room, setRoom] = useState<null | string>(null);
  const [mainMenuState, setMainMenuState] = useState<MenuStatus>("main");
  const [isRuning, setIsRunning] = useState(false);
  const [gameState, setGameState] = useState<GameStatus>("prepering");
  const [playersCount, setPlayersCount] = useState(1);

  return (
    <GameStatesContext.Provider
      value={{
        room,
        mainMenuState,
        isRuning,
        gameState,
        playersCount,

        setPlayersCount,
        setGameState,
        setMainMenuState,
        setRoom,
        setIsRunning,
      }}
    >
      {children}
    </GameStatesContext.Provider>
  );
}

export const useGameStates = () => {
  const context = useContext(GameStatesContext);
  if (!context) {
    throw new Error("useControls must be used within a ControlsProvider");
  }
  return context;
};
