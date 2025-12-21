import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useSearchParams } from "react-router-dom";

type SearchState = {
  query: string;
  setQuery: (value: string) => void;
};

const SearchContext = createContext<SearchState | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const location = useLocation();
  const [params, setParams] = useSearchParams();

  // Clear search when navigating to non-search screens
  useEffect(() => {
    const path = location.pathname;
    const shouldClear =
      path === "/favorites" || path === "/recent" || path === "/about";

    if (!shouldClear) return;

    // Clear in-memory query
    if (query !== "") setQuery("");

    // Remove q= from URL (keep history clean)
    if (params.has("q")) {
      const next = new URLSearchParams(params);
      next.delete("q");
      setParams(next, { replace: true });
    }
    // Intentionally depend only on pathname to avoid param/set loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const value = useMemo(() => ({ query, setQuery }), [query]);

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return ctx;
}
