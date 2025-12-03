import { NavLink } from "react-router-dom";

type NavItem = {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
};

const ITEMS: NavItem[] = [
  { to: "/", label: "Characters", icon: "▦", end: true },
  { to: "/favorites", label: "Favorites", icon: "★" },
  { to: "/recent", label: "Recent", icon: "🕒" },
];

export default function AppNav() {
  return (
    <nav className="app-nav" aria-label="Primary">
      <ul className="app-nav__list">
        {ITEMS.map((item) => (
          <li key={item.to} className="app-nav__item">
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  "app-nav__button",
                  isActive ? "app-nav__button--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              <span
                className="app-nav__icon"
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span className="app-nav__label">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
