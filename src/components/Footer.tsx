import Logo from "./Logo";

export default function Footer() {
  return (
    <footer>
      <div>
        <Logo />
        <p>© {new Date().getFullYear()} Typeclipper</p>
        <p>
          Built by{" "}
          <a
            href="https://madebypilcrow.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pilcrow
          </a>
          . Cobbled together with React. Garnished with STIX Two & IBM Plex Sans. This app does not track you. Thanks for stopping by.
        </p>
      </div>
    </footer>
  );
}
