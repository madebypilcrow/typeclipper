import SearchField from "@/components/SearchField";
import { useSearch } from "@/context/SearchContext";
import "@/styles/searchControls.scss";

export default function SearchControls() {
  const { query, setQuery } = useSearch();

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