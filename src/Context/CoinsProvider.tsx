import { createContext, useContext, ReactNode, useState } from "react";

type ProvidedValues = {
  coins: [number, number, number][];
  setCoins: React.Dispatch<React.SetStateAction<[number, number, number][]>>;
};
const CoinsContext = createContext<ProvidedValues | null>(null);

export default function CoinsProvider({ children }: { children: ReactNode }) {
  const [coins, setCoins] = useState<[number, number, number][]>([]);

  return (
    <CoinsContext.Provider value={{ coins, setCoins }}>
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
