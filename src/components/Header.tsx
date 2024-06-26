import NetworkPicker from "views/NetworkPicker.js";

export const Header = () => (
  <div className="so-back" data-testid="page-header">
    <div className="so-chunk">
      <div className="so-siteHeader LaboratoryChrome__header">
        <span className="so-logo">
          <a href="https://minepi.com/" className="so-logo__main">
            PI
          </a>
          <span className="so-logo__separator"> </span>
          <a href="#" className="so-logo__subSite">
            Laboratory
          </a>
        </span>

        <NetworkPicker />
      </div>
    </div>
  </div>
);
