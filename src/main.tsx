import ReactDOM from "react-dom/client";
import App from "./App";
import { SearchProvider } from "@/context/SearchContext";
import "./styles/main.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <SearchProvider>
    <App />
  </SearchProvider>
);