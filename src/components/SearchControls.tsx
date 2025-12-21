import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import SearchField from "@/components/SearchField";
import { useSearch } from "@/context/SearchContext";
import "@/styles/searchControls.scss";

export default function SearchControls() {
  const { query, setQuery } = useSearch();
  const [params, setParams] = useSearchParams();

  // 1) On mount: initialize search state from URL
  useEffect(() => {
    const q = params.get("q") ?? "";
    if (q !== query) {
      setQuery(q);
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Whenever query changes: sync to URL (replace history entry)
  useEffect(() => {
    const next = new URLSearchParams(params);

    if (query.trim()) {
      next.set("q", query);
    } else {
      next.delete("q");
    }

    setParams(next, { replace: true });
  }, [query, params, setParams]);

  return (
    <div className="search-controls">
      <SearchField
        value={query}
        onChange={setQuery}
        onClear={() => setQuery("")}
        isLoading={false}
      />
    </div>
  );
}