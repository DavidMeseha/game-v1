import { createContext, useContext, ReactNode, useState } from "react";

type MenuStatus = "naming" | "join" | "create" | "main" | "waiting";
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
  isSpectator: boolean;
  setIsSpectator: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: string | null | undefined;
  setIsLoading: React.Dispatch<React.SetStateAction<string | null | undefined>>;
};

const GameStatesContext = createContext<ProvidedValues | null>(null);

export function GameStatesProvider({ children }: { children: ReactNode }) {
  const [room, setRoom] = useState<null | string>(null);
  const [mainMenuState, setMainMenuState] = useState<MenuStatus>("naming");
  const [isRuning, setIsRunning] = useState(false);
  const [gameState, setGameState] = useState<GameStatus>("prepering");
  const [playersCount, setPlayersCount] = useState(1);
  const [isSpectator, setIsSpectator] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null | undefined>();

  return (
    <GameStatesContext.Provider
      value={{
        room,
        mainMenuState,
        isRuning,
        gameState,
        playersCount,
        isSpectator,
        isLoading,

        setIsLoading,
        setIsSpectator,
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
