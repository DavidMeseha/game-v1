import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import InitLayout from "./InitLayout";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <InitLayout>
      <App />
    </InitLayout>
  </StrictMode>
);
