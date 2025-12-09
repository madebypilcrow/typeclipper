import { NavLink } from "react-router-dom";

import CharactersIcon from "@/icons/characters-outline.svg?react";
import CharactersIconFilled from "@/icons/characters-filled.svg?react";
import FavoritesIcon from "@/icons/favorites-outline.svg?react";
import FavoritesIconFilled from "@/icons/favorites-filled.svg?react";
import RecentIcon from "@/icons/recent-outline.svg?react";
import RecentIconFilled from "@/icons/recent-filled.svg?react";
import AboutIcon from "@/icons/about-outline.svg?react";
import AboutIconFilled from "@/icons/about-filled.svg?react";

import "@/styles/appNav.scss";

type NavItem = {
  to: string;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  IconActive: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  end?: boolean;
  className?: string; // for the About item hook
};

const ITEMS: NavItem[] = [
  {
    to: "/",
    label: "Characters",
    Icon: CharactersIcon,
    IconActive: CharactersIconFilled,
    end: true,
  },
  {
    to: "/favorites",
    label: "Favorites",
    Icon: FavoritesIcon,
    IconActive: FavoritesIconFilled,
  },
  {
    to: "/recent",
    label: "Recent",
    Icon: RecentIcon,
    IconActive: RecentIconFilled,
  },
  {
    to: "/about",
    label: "About",
    Icon: AboutIcon,
    IconActive: AboutIconFilled,
    className: "app-nav__item--about",
  },
];

export default function AppNav() {
  return (
    <nav className="app-nav" aria-label="Primary">
      <ul className="app-nav__list">
        {ITEMS.map((item) => (
          <li
            key={item.to}
            className={["app-nav__item", item.className]
              .filter(Boolean)
              .join(" ")}
          >
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  "app-nav__button",
                  isActive && "app-nav__button--active",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              {({ isActive }) => {
                const IconComponent = isActive ? item.IconActive : item.Icon;
                return (
                  <>
                    <span className="app-nav__icon" aria-hidden="true">
                      <IconComponent />
                    </span>
                    <span className="app-nav__label">{item.label}</span>
                  </>
                );
              }}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}