import { useControls, folder, button } from "leva";
import { useState } from "react";

export const useCoinControlDev = () => {
  const [coins, setCoins] = useState([{ x: 0, z: 0 }]);

  // Generate Leva controls for each coin
  const coinControls = coins.reduce((acc, coin, idx) => {
    acc[`Coin ${idx + 1}`] = folder({
      x: {
        value: coin.x,
        min: -500,
        max: 500,
        step: 1,
        onChange: (v: number) => {
          setCoins((prev) => {
            const next = [...prev];
            next[idx].x = v;
            return next;
          });
        },
      },
      z: {
        value: coin.z,
        min: -1000,
        max: 1000,
        step: 1,
        onChange: (v: number) => {
          setCoins((prev) => {
            const next = [...prev];
            next[idx].z = v;
            return next;
          });
        },
      },
    });
    return acc;
  }, {} as Record<string, unknown>);

  // Use a key that changes when coins.length changes to force Leva to remount controls
  useControls("Character Control", {
    Coins: folder({
      ...coinControls,
      Add: button(() => setCoins((prev) => [...prev, { x: 0, z: 0 }])),
    }),
  });

  return {
    coins,
    setCoins,
  };
};
