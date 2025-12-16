import "@/styles/appBanner.scss";

export default function AppBanner() {
  return (
    <aside className="app-banner" role="note">
      <p className="app-banner__text">
        <span className="app-banner__icon">Building in public.</span>{" "}
        Typeclipper is a{" "}
        <a
          href="https://madebypilcrow.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pilcrow
        </a>{" "}
        side project by{" "}
        <a
          href="https://x.com/beltechi"
          target="_blank"
          rel="noopener noreferrer"
        >
          @beltechi
        </a>
        .
      </p>
    </aside>
  );
}