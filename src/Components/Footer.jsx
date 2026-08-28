import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="brand footer-logo">
            <span className="brand-mark">B</span>

            <span className="brand-name">
              BIZ<span>-</span>ETHICS
            </span>
          </div>

          <p>
            Networking, surveillance
            <br />
            & security infrastructure.
          </p>
        </div>

        <div className="footer-column">
          <span className="footer-title">
            CONTACT
          </span>

          <a href="tel:08033883255">
            <Phone size={15} />
            0803 388 3255
          </a>

          <a href="tel:08023036619">
            <Phone size={15} />
            0802 303 6619
          </a>

          <a href="mailto:ethicsv@gmail.com">
            <Mail size={15} />
            ethicsv@gmail.com
          </a>
        </div>

        <div className="footer-column">
          <span className="footer-title">
            LOCATION
          </span>

          <p>
            <MapPin size={15} />

            <span>
              7, Otigba Street
              <br />
              Computer Village, Ikeja
              <br />
              Lagos, Nigeria
            </span>
          </p>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Biz-Ethics Ltd.
        </span>

        <span>
          NETWORKS / SECURITY / INFRASTRUCTURE
        </span>
      </div>
    </footer>
  );
}

export default Footer;