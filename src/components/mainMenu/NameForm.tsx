import { useRef } from "react";
import { useGameStates } from "../../Context/GameStatesProvider";

type Props = {
  setName: (name: string) => void;
};

export default function NameForm({ setName }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { setMainMenuState } = useGameStates();

  return (
    <>
      <p>Your Name.</p>
      <input type="text" ref={inputRef} className="w-full text-center" />
      <button
        className="mt-1"
        onClick={() => {
          setMainMenuState("main");
          console.log("Name set to:", inputRef.current?.value);
          setName(inputRef.current?.value || "");
        }}
      >
        Proceed
      </button>
    </>
  );
}
