import Logo from "./Logo";
import "@/styles/footer.scss";

export default function Footer() {
  return (
    <footer className="section app-footer">
      <div className="section-wrapper app-footer__wrapper">
        <a
          href="#top"
          className="app-footer__logo-link"
          aria-label="Back to top"
        >
          <Logo className="app-footer__logo" />
        </a>

        <div className="app-footer__illo">
          <pre>{String.raw`~\---{ < ¶ > }---/~`}</pre>
        </div>

        <p className="app-footer__message">
          You’ve reached the bottom of the drawer. Nothing left rattling around. If something *should* be in here and isn’t, let the late‑shift typesetter know at dan [at] madebypilcrow [dot] com.
        </p>

        <div className="app-footer__meta">
          <span className="app-footer__copyright">
            © {new Date().getFullYear()} Typeclipper.
          </span>
          <span className="app-footer__colophon">
            &nbsp;Built by{" "}
            <a
              href="https://madebypilcrow.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pilcrow
            </a>
            . Cobbled together with React. Garnished with STIX Two & IBM Plex Sans.
            This app does not track you. Thanks for stopping by.
          </span>
        </div>
      </div>
    </footer>
  );
}