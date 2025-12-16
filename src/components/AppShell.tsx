import type { ReactNode } from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppBanner from "@/components/AppBanner";
import "@/styles/appShell.scss";

type Props = {
  children: ReactNode;
};

export default function AppShell({ children }: Props) {
  return (
    <div className="app-shell">
      <AppBanner />
      <Header />

      <main className="app-main">
        {children}
      </main>

      <Footer />
    </div>
  );
}