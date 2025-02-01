import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

interface Player {
  id: string;
  position: [number, number, number];
  rotation: number;
}

interface SocketContextType {
  players: Player[];
  id: string;
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({
  players: [],
  id: "",
  socket: null,
});

export default function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_SERVER);
    setSocket(newSocket);

    const handleConnect = () => {
      console.log("Connected to server");
    };
    const handleId = (id: string) => setId(id);
    const handlePlayers = (props: Player[]) => setPlayers(props);

    newSocket.on("connect", handleConnect);
    newSocket.on("id", handleId);
    newSocket.on("players", handlePlayers);

    return () => {
      newSocket.off("connect", handleConnect);
      newSocket.off("id", handleId);
      newSocket.off("players", handlePlayers);
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ players, id, socket }}>
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
