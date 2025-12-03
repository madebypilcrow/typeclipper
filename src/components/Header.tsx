import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import AppNav from "@/components/AppNav";
import "@/styles/header.scss";

export default function Header() {
  return (
    <header className="app-header section">
      <div className="section-wrapper app-header__wrapper">
        <Link
          to="/"
          className="app-header__logo-link"
          aria-label="Typeclipper home"
        >
          <Logo />
        </Link>

        <AppNav />
      </div>
    </header>
  );
}