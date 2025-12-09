// src/components/AppShell.tsx
import type { ReactNode } from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/appShell.scss";

type Props = {
  children: ReactNode;
};

export default function AppShell({ children }: Props) {
  return (
    <div className="app-shell">
      <Header />

      <main className="app-main">
        {children}
      </main>

      <Footer />
    </div>
  );
}