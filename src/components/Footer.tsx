import Logo from "./Logo";
import "@/styles/footer.scss";

export default function Footer() {
  return (
    <footer className="section footer">
      <div className="section-wrapper footer__wrapper">
        <a href="#top" className="footer__logo-link">
          <Logo />
        </a>

        <p className="footer__message">
          You’ve reached the bottom of the drawer. Nothing left rattling around. If something *should* be in here and isn’t, let me know at  dan [at] madebypilcrow [dot] com.

        </p>

        <p className="footer__copyright">
          © {new Date().getFullYear()} Typeclipper
        </p>

        <p className="footer__colophon">
          Built by{" "}
          <a
            href="https://madebypilcrow.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pilcrow
          </a>
          . Cobbled together with React. Garnished with STIX Two & IBM Plex Sans.
          This app does not track you. Thanks for stopping by.
        </p>
      </div>
    </footer>
  );
}