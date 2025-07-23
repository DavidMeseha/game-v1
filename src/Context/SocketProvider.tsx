import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { IOError } from "../types";
import { useGameStates } from "./GameStatesProvider";
import { useCoins } from "./CoinsProvider";

interface Player {
  id: string;
  coins: number;
  position: [number, number, number];
  rotation: number;
  isSpectator: boolean;
  name: string
}

interface SocketContextType {
  players: Player[];
  id: string;
  socket: Socket | undefined;
  handleCreateRoom: (isSpectator: boolean, name: string) => void;
  handleJoinRoom: (
    roomName: string,
    isSpectator: boolean,
    name: string
  ) => void;
  handleRoomCancel: () => void;
  handleStartGame: () => void;
  handleLeaveRoom: () => void;
  handleCoinPick: (coinPosition: [number, number, number], idx: number) => void;
  clearError: () => void;
  error: IOError;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export default function SocketProvider({ children }: { children: ReactNode }) {
  const { setCoins, removeCoin } = useCoins();
  const [socket, setSocket] = useState<Socket | undefined>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [id, setId] = useState<string>("");
  const [error, setError] = useState<IOError>();
  const {
    setRoom,
    setMainMenuState,
    setGameState,
    setPlayersCount,
    setIsSpectator,
  } = useGameStates();

  const handleCreateRoom = (isSpectator: boolean, name: string) => {
    console.log(name)
    if (!socket) return;
    socket.emit("createRoom", { isSpectator, name });
    clearError();
  };

  const handleJoinRoom = (
    roomName: string,
    isSpectator: boolean,
    name: string
  ) => {
    console.log(name)
    if (!socket) return;
    socket.emit("joinRoom", { roomName, isSpectator, name });
  };

  const handleRoomCancel = () => {
    if (!socket) return;
    socket.emit("cancelRoom");
    setMainMenuState("main");
    setRoom(null);
    clearError();
    setPlayersCount(1);
  };

  const handleStartGame = () => {
    if (!socket) return;
    socket.emit("start");
  };

  const handleLeaveRoom = () => {
    if (!socket) return;
    socket.emit("leaveRoom");
    setGameState("prepering");
    setMainMenuState("main");
    clearError();
  };

  const clearError = () => setError(null);

  const handleCoinPick = (
    coinPosition: [number, number, number],
    idx: number
  ) => {
    if (!socket) return;
    removeCoin(idx);
    socket.emit("coinPicked", { coinPosition });
  };

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_SERVER);
    setSocket(newSocket);

    newSocket.on("connect_error", () => {
      setError("Connection error");
      setGameState("prepering");
      setMainMenuState("main");
    });

    newSocket.on("connect", () => {
      setError(null);
      console.log("Connected to server");
    });

    const handleId = (id: string) => setId(id);
    const handlePlayers = (props: Player[]) => setPlayers(props);

    const handleCreatedRoom = ({
      room,
      isSpectator,
    }: {
      room: string;
      isSpectator: boolean;
    }) => {
      setIsSpectator(isSpectator);
      setMainMenuState("create");
      setPlayersCount(1);
      setRoom(room);
    };

    newSocket.on("coins", (coins: [number, number, number][]) => {
      setCoins(coins);
    });
    newSocket.on("connect", () => {});
    newSocket.on("error", (err: string) => setError(err));
    newSocket.on("id", handleId);
    newSocket.on("players", handlePlayers);
    newSocket.on("created", handleCreatedRoom);
    newSocket.on("started", () => setGameState("playing"));
    newSocket.on(
      "joined",
      ({ isSpectator, id }: { isSpectator: boolean; id: string }) => {
        setId(id);
        setIsSpectator(isSpectator);
        setMainMenuState("waiting");
        clearError();
      }
    );
    newSocket.on("roomDisconnected", () => {
      setRoom(null);
      setError("Room disconnected");
      setMainMenuState("main");
    });
    newSocket.on("playersCount", (count) => {
      setPlayersCount(count);
    });

    return () => {
      newSocket.off("connect", () => {});
      newSocket.off("id", handleId);
      newSocket.off("players", handlePlayers);
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        players,
        id,
        socket,
        handleCreateRoom,
        handleJoinRoom,
        handleRoomCancel,
        handleStartGame,
        handleLeaveRoom,
        handleCoinPick,
        clearError,
        error,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
