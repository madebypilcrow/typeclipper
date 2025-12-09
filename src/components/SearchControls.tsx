import SearchField from "@/components/SearchField";
import "@/styles/searchControls.scss";

type Props = {
  query: string;
  isLoading?: boolean;
  onChange: (value: string) => void;
  onClear: () => void;
};

export default function SearchControls({
  query,
  isLoading = false,
  onChange,
  onClear,
}: Props) {
  return (
    <div className="search-controls">
      <SearchField
        value={query}
        isLoading={isLoading}
        onChange={onChange}
        onClear={onClear}
      />
    </div>
  );
}