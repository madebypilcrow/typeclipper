import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "@/components/AppShell";
import GlyphsPage from "@/pages/GlyphsPage";
import FavoritesPage from "@/pages/FavoritesPage";
import RecentsPage from "@/pages/RecentsPage";
import AboutPage from "@/pages/AboutPage";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <AppShell>
        <Routes>
          <Route path="/" element={<GlyphsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/recent" element={<RecentsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}