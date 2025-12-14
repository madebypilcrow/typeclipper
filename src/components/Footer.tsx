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

        {/*<div className="app-footer__illo">
          <pre>{String.raw`~\---{ < ¶ > }---/~`}</pre>
        </div>*/}

        <div className="app-footer__meta">
          <p className="app-footer__message">
            You’ve reached the bottom of the drawer. Nothing left rattling around. If something’s wrong or missing let the late&#8209;shift typesetter know at dan [at] madebypilcrow [dot] com.
          </p>

          {/*<span className="app-footer__copyright">
            © {new Date().getFullYear()} Typeclipper.
          </span>*/}
          <p className="app-footer__colophon">
            Made by{" "}
            <a
              href="https://madebypilcrow.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pilcrow
            </a>
            , typeset in STIX Two & IBM Plex Sans. This app does not track you.
          </p>
        </div>
      </div>
    </footer>
  );
}