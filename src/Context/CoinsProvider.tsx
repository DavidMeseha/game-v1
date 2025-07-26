import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import socketService from "../services/socket";

type ProvidedValues = {
  coins: [number, number, number][];
  setCoins: React.Dispatch<React.SetStateAction<[number, number, number][]>>;
  removeCoin: (idx: number) => void;
};
const CoinsContext = createContext<ProvidedValues | null>(null);

export default function CoinsProvider({ children }: { children: ReactNode }) {
  const [coins, setCoins] = useState<[number, number, number][]>([]);

  const removeCoin = (idx: number) => {
    setCoins((prevCoins) => {
      const newCoins = [...prevCoins];
      newCoins.splice(idx, 1);
      return newCoins;
    });
  };

  useEffect(() => {
    socketService.on("coins", setCoins);

    return () => {
      socketService.off("coins", setCoins);
    };
  }, []);

  return (
    <CoinsContext.Provider value={{ coins, removeCoin, setCoins }}>
      {children}
    </CoinsContext.Provider>
  );
}

export const useCoins = () => {
  const context = useContext(CoinsContext);
  if (!context) {
    throw new Error("useControls must be used within a ControlsProvider");
  }
  return context;
};
