import Coin from "../components/Coin";
import { useCoins } from "../Context/CoinsProvider";
// import { useCoinControlDev } from "../hooks/useCoinControlDev";

// type Props = {};

export default function Coins() {
  const { coins } = useCoins();
  // const { coins } = useCoinControlDev();
  return (
    <>
      {/* {coins.map((position, index) => (
        <Coin position={[position.x, -2, position.z]} key={index} />
      ))} */}
      {coins.map((position) => (
        <Coin position={[...position]} key={JSON.stringify(position)} />
      ))}
    </>
  );
}
