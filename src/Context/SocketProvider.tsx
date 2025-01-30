import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { io } from "socket.io-client";

interface Player {
  id: string;
  position: [number, number, number];
  rotation: number;
}
export const socket = io(import.meta.env.VITE_SOCKET_SERVER);
const SocketContext = createContext<{
  players: Player[];
  id: string;
}>({
  players: [],
  id: "",
});

export default function SocketProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [id, setId] = useState<string>("");
  useEffect(() => {
    socket.on("connect", () => {});
    socket.on("id", (id) => setId(id));
    socket.on("players", (props: Player[]) => {
      setPlayers(props.filter((player) => player.id !== id));
    });
  }, []);

  return (
    <SocketContext.Provider value={{ players, id }}>
      {children}
    </SocketContext.Provider>
  );
}

export function UseSocket() {
  return useContext(SocketContext);
}
