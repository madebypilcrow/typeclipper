import type { ReactNode } from "react";
import { useCallback, useState } from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppBanner from "@/components/AppBanner";
import Toast from "@/components/Toast";
import { ToastProvider } from "@/context/Toast";
import "@/styles/appShell.scss";

type Props = {
  children: ReactNode;
};

export default function AppShell({ children }: Props) {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
  }, []);

  return (
    <div className="app-shell">
      <ToastProvider value={{ showToast }}>
        <AppBanner />
        <Header />

        <main className="app-main">{children}</main>

        <Footer />
      </ToastProvider>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}