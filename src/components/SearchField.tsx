import "@/styles/searchControls.scss";
import SearchIcon from "@/icons/search.svg?react";
import ClearIcon from "@/icons/cancel.svg?react";
import SearchSpinnerIcon from "@/icons/search-spinner.svg?react";

type SearchFieldProps = {
  value?: string;
  placeholder?: string;
  isLoading?: boolean;
  onChange?: (value: string) => void;
  onClear?: () => void;
};

export default function SearchField({
  value,
  placeholder = "Search characters",
  isLoading = false,
  onChange,
  onClear,
}: SearchFieldProps) {
  const showClear = !!value && !isLoading;

  return (
    <label className="search-input">
      {/* LEFT ICON */}
      <span className="search-input__icon" aria-hidden="true">
        {isLoading ? (
          <SearchSpinnerIcon className="search-input__spinner" />
        ) : (
          <SearchIcon className="search-input__icon-glyph" />
        )}
      </span>

      <span className="sr-only">Search characters</span>

      {/* INPUT */}
      <input
        type="search"
        name="search"
        className="search-input__field"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        autoComplete="off"
      />

      {/* CLEAR BUTTON */}
      {showClear && (
        <button
          type="button"
          className="search-input__clear"
          onClick={onClear}
          aria-label="Clear search"
        >
          <ClearIcon />
        </button>
      )}
    </label>
  );
}