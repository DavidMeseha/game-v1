import { useRef } from "react";
import { useGameStates } from "../../../Context/GameStatesProvider";

export default function NameForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { setMainMenuState, setName } = useGameStates();

  return (
    <>
      <p>Your Name.</p>
      <input type="text" ref={inputRef} className="w-full text-center mt-1" />
      <button
        className="mt-1"
        onClick={() => {
          setMainMenuState("main");
          setName(inputRef.current?.value || "");
        }}
      >
        Proceed
      </button>
    </>
  );
}
