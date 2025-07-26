import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import GameEntryPoint from "./GameEntryPoint";
import ProvidersLayout from "./Context/ProvidersLayout";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProvidersLayout>
      <GameEntryPoint />
    </ProvidersLayout>
  </StrictMode>
);
