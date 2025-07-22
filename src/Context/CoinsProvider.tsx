import { createContext, useContext, ReactNode, useState } from "react";

type ProvidedValues = {
  coins: [number, number, number][];
  setCoins: React.Dispatch<React.SetStateAction<[number, number, number][]>>;
  handlePickCoin: (idx: number) => void;
};
const CoinsContext = createContext<ProvidedValues | null>(null);

export default function CoinsProvider({ children }: { children: ReactNode }) {
  const [coins, setCoins] = useState<[number, number, number][]>([]);

  const handlePickCoin = (idx: number) => {
    setCoins((prevCoins) => {
      const newCoins = [...prevCoins];
      newCoins.splice(idx, 1);
      return newCoins;
    });
  };

  return (
    <CoinsContext.Provider value={{ coins, handlePickCoin, setCoins }}>
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
