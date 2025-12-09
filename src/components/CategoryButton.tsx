import "@/styles/searchControls.scss";

type CategoryButtonProps = {
  label?: string;
  onClick?: () => void;
};

export default function CategoryButton({
  label = "Categories",
  onClick,
}: CategoryButtonProps) {
  return (
    <button
      type="button"
      className="search-filter"
      onClick={onClick}
    >
      <span className="search-filter__icon" aria-hidden="true">
        ⚙︎
      </span>
      <span className="search-filter__label">{label}</span>
    </button>
  );
}