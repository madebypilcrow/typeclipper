// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "@/components/AppShell";
import GlyphsPage from "@/pages/GlyphsPage";
import FavoritesPage from "@/pages/FavoritesPage";
import RecentPage from "@/pages/RecentPage";

const basename = import.meta.env.BASE_URL.replace(/\/$/, ""); 
// '/typeclipper/' -> '/typeclipper'

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      {/* scroll target for the footer logo */}
      <div id="top" />

      <AppShell>
        <Routes>
          <Route path="/" element={<GlyphsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/recent" element={<RecentPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}