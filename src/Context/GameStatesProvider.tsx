import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { IOError } from "../types";
import socketService from "../services/socket";
import {
  clearPlayerReconnectionData,
  getPlayerReconnectionData,
  savePlayerReconnectionData,
} from "../services/localStorage";

type MenuStatus =
  | "naming"
  | "join"
  | "create"
  | "main"
  | "waiting"
  | "reconnect";
type GameStatus = "prepering" | "playing" | "ended";

interface Player {
  id: string;
  coins: number;
  position: [number, number, number];
  rotation: number;
  isSpectator: boolean;
  name: string;
}

type ProvidedValues = {
  room: string;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
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
  id: string;
  setId: React.Dispatch<React.SetStateAction<string>>;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  error: IOError;
  setError: React.Dispatch<React.SetStateAction<IOError>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  clearError: () => void;
};

const GameStatesContext = createContext<ProvidedValues | null>(null);

export function GameStatesProvider({ children }: { children: ReactNode }) {
  const [room, setRoom] = useState<string>("");
  const [isRuning, setIsRunning] = useState(false);
  const [gameState, setGameState] = useState<GameStatus>("prepering");
  const [playersCount, setPlayersCount] = useState(1);
  const [isSpectator, setIsSpectator] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null | undefined>();
  const [id, setId] = useState<string>("0");
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<IOError>();
  const [name, setName] = useState<string>("");
  const [mainMenuState, setMainMenuState] = useState<MenuStatus>(() => {
    const reconnectionData = getPlayerReconnectionData();
    if (reconnectionData) return "reconnect";
    return "naming";
  });

  useEffect(() => {
    const handleError = (err: string) => {
      setError(err);
      setIsLoading(null);
    };

    const handleConnectionError = () => {
      setError("Connection error");
      setGameState("prepering");
      setMainMenuState("reconnect");
    };

    const handleConnectionSuccess = () => {
      setError(null);
    };

    const handleId = (id: string) => setId(id);

    const handlePlayers = (props: Player[]) => {
      setPlayers(props);
      setPlayersCount(props.length);
    };

    const handleRoomDisconnected = () => {
      setRoom("");
      setError("Room disconnected");
      setMainMenuState("main");
    };

    const handleReconnection = ({
      inGame,
      isSpectator,
      newId,
      isCreator,
      room,
    }: {
      inGame: boolean;
      isSpectator: boolean;
      newId: string;
      isCreator: boolean;
      room: string;
    }) => {
      setIsLoading(null);
      setRoom(room);
      setId(newId);
      setIsSpectator(isSpectator);
      if (inGame) setGameState("playing");
      else {
        setGameState("prepering");
        if (isCreator) setMainMenuState("create");
        else setMainMenuState("waiting");
      }
      savePlayerReconnectionData(newId, room);
    };

    const handleGameStarted = () => setGameState("playing");

    const handleReconnectionError = (err: string) => {
      setError(err);
      setIsLoading(null);
      setMainMenuState("naming");
      clearPlayerReconnectionData();
    };

    socketService.on("connect", handleConnectionSuccess);
    socketService.on("connect_error", handleConnectionError);
    socketService.on("reconnected", handleReconnection);
    socketService.on("reconnect_error", handleReconnectionError);
    socketService.on("id", handleId);
    socketService.on("players", handlePlayers);
    socketService.on("started", handleGameStarted);
    socketService.on("roomDisconnected", handleRoomDisconnected);
    socketService.on("error", handleError);

    return () => {
      socketService.off("connect_error", handleConnectionError);
      socketService.off("error", handleError);
      socketService.off("connect", handleConnectionSuccess);
      socketService.off("reconnected", handleReconnection);
      socketService.off("id", handleId);
      socketService.off("players", handlePlayers);
      socketService.off("started", handleGameStarted);
      socketService.off("roomDisconnected", handleRoomDisconnected);
      // socketService.close();
    };
  }, []);

  useEffect(() => {
    if (id === "0" || !room || !id) return;
    savePlayerReconnectionData(id, room);
  }, [room, id]);

  const clearError = () => setError(null);

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
        id,
        players,
        error,
        name,

        setName,
        setError,
        setPlayers,
        setId,
        setIsLoading,
        setIsSpectator,
        setPlayersCount,
        setGameState,
        setMainMenuState,
        setRoom,
        setIsRunning,

        clearError,
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
