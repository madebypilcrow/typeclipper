import Logo from "@/components/Logo";
import AppNav from "@/components/AppNav";
import "@/styles/header.scss";

export default function Header() {
  return (
    <header className="app-header section">
      <div className="section-wrapper">
        <Logo />
        <AppNav />
      </div>
    </header>
  );
}