import {
  ArrowUpRight,
  Camera,
  CheckCircle2,
  ChevronRight,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Network,
  Phone,
  ShieldCheck,
  Wrench,
  X,
} from "lucide-react";

import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";

import Products from "./pages/Products.jsx";
import "./App.css";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      closeMenu();
    }
  };

  const generalMessage = encodeURIComponent(
    "Hello Biz-Ethics, I would like to make an enquiry about your products/services."
  );

  const projectMessage = encodeURIComponent(
    "Hello Biz-Ethics, I would like to discuss a project."
  );

  const productMessage = encodeURIComponent(
    "Hello Biz-Ethics, I'm looking for networking/security equipment. Can you help?"
  );

  return (
    <div className="site">
      {/* =========================
          NAVIGATION
      ========================= */}

      <header className="navbar">
        <div className="container nav-inner">
          <button
            className="brand"
            onClick={() => scrollToSection("home")}
            aria-label="Biz-Ethics home"
          >
            <span className="brand-mark">B</span>

            <span className="brand-name">
              BIZ<span>-</span>ETHICS
            </span>
          </button>

          <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
            <button onClick={() => scrollToSection("home")}>
              Home
            </button>

            <button onClick={() => scrollToSection("solutions")}>
              Solutions
            </button>

            <button onClick={() => scrollToSection("products")}>
              Products
            </button>

            <button onClick={() => scrollToSection("about")}>
              About
            </button>

            <button
              className="nav-contact"
              onClick={() => scrollToSection("contact")}
            >
              Contact
              <ArrowUpRight size={16} />
            </button>
          </nav>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <main>
        {/* =========================
            HERO
        ========================= */}

        <section className="hero" id="home">
          <div className="container hero-grid">
            <div className="hero-content">
              <div className="eyebrow">
                NETWORKS · SURVEILLANCE · SECURITY
              </div>

              <h1>
                Networking.
                <br />
                <em>Security.</em>
                <br />
                Done right.
              </h1>

              <p className="hero-text">
                We supply, install and support networking, CCTV and
                security systems for homes, offices and businesses
                in and out of Lagos.
              </p>

              <div className="hero-actions">
                <a
                  href={`https://wa.me/2348033883255?text=${generalMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="button button-primary"
                >
                  <MessageCircle size={18} />
                  Contact us
                </a>

                <button
                  className="button button-secondary"
                  onClick={() => scrollToSection("solutions")}
                >
                  View our services
                  <ArrowUpRight size={18} />
                </button>
              </div>

              <div className="hero-location">
                <MapPin size={15} />
                <span>Computer Village, Ikeja · Lagos</span>
              </div>
            </div>

            {/* HERO SYSTEM VISUAL */}

            <div className="hero-visual">
              <div className="system-card">
                <div className="system-header">
                  <span>BIZ-ETHICS LTD.</span>
                  <span>SYSTEM / 001</span>
                </div>

                <div className="system-title">
                  <span>CONNECTED INFRASTRUCTURE</span>
                  <strong>01</strong>
                </div>

                <div className="system-flow">
                  <div className="system-item">
                    <div className="system-icon">
                      <Camera size={22} />
                    </div>

                    <div>
                      <strong>CCTV</strong>
                      <span>Surveillance</span>
                    </div>
                  </div>

                  <div className="flow-line"></div>

                  <div className="system-item">
                    <div className="system-icon">
                      <ShieldCheck size={22} />
                    </div>

                    <div>
                      <strong>SECURITY</strong>
                      <span>Protection</span>
                    </div>
                  </div>

                  <div className="flow-line"></div>

                  <div className="system-item">
                    <div className="system-icon">
                      <Network size={22} />
                    </div>

                    <div>
                      <strong>NETWORK</strong>
                      <span>Connectivity</span>
                    </div>
                  </div>
                </div>

                <div className="system-footer">
                  <span className="system-ready">
                    <span className="live-dot"></span>
                    SYSTEM READY
                  </span>

                  <span>LAGOS / NG</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            WHO WE SERVE
        ========================= */}

        <section className="audience-section">
          <div className="container audience-inner">
            <span className="section-number">
              WHO WE SERVE
            </span>

            <div>
              <h3>
                For homes, offices
                <br />
                & everything in between.
              </h3>

              <p>
                We work with homeowners, businesses, schools,
                churches, hotels, contractors and IT companies.
              </p>
            </div>
          </div>
        </section>

        {/* =========================
            SOLUTIONS
        ========================= */}

        <section className="section solutions" id="solutions">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-number">
                  01 / SOLUTIONS
                </span>

                <h2>
                  Everything you need
                  <br />
                  <em>to get connected.</em>
                </h2>
              </div>

              <p>
                From equipment supply to complete installations,
                we help homes, offices and organizations build,
                secure and maintain their technical infrastructure.
              </p>
            </div>

            <div className="solution-grid">
              <article className="solution-card large-card">
                <div className="card-number">01</div>

                <div className="solution-icon">
                  <Network size={30} />
                </div>

                <div className="solution-content">
                  <h3>Networking</h3>

                  <p>
                    Reliable wired and wireless networks for homes,
                    offices and larger installations.
                  </p>

                  <button
                    onClick={() => scrollToSection("contact")}
                  >
                    Tell us about that network
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </article>

              <article className="solution-card">
                <div className="card-number">02</div>

                <div className="solution-icon">
                  <Camera size={28} />
                </div>

                <div className="solution-content">
                  <h3>CCTV & Surveillance</h3>

                  <p>
                    Supply and installation of surveillance systems
                    designed around your space.
                  </p>

                  <button
                    onClick={() => scrollToSection("contact")}
                  >
                    Get a quote
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </article>

              <article className="solution-card">
                <div className="card-number">03</div>

                <div className="solution-icon">
                  <ShieldCheck size={28} />
                </div>

                <div className="solution-content">
                  <h3>Security Systems</h3>

                  <p>
                    Access control and related security equipment
                    for homes and organizations.
                  </p>

                  <button
                    onClick={() => scrollToSection("contact")}
                  >
                    Make an enquiry
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </article>

              <article className="solution-card wide-card">
                <div className="card-number">04</div>

                <div className="solution-icon">
                  <Wrench size={28} />
                </div>

                <div className="solution-content">
                  <h3>
                    Installation & Troubleshooting
                  </h3>

                  <p>
                    Already have a system that isn't behaving?
                    We diagnose network and surveillance issues
                    and get things back on track.
                  </p>

                  <button
                    onClick={() => scrollToSection("contact")}
                  >
                    Talk to a technician
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* =========================
            PRODUCTS
        ========================= */}

        <section
          className="section products-section"
          id="products"
        >
          <div className="container">
            <div className="section-heading product-heading">
              <div>
                <span className="section-number">
                  02 / EQUIPMENT
                </span>

                <h2>
                  Equipment for
                  <br />
                  <em>the job.</em>
                </h2>
              </div>

              <p>
                Looking for networking, CCTV, fibre or security
                equipment? Tell us what you need and we'll help
                you find the right hardware.
              </p>
            </div>

            <div className="product-list">
              <Link
                to="/products?category=networking"
                className="product-row"
              >
                <span className="product-index">01</span>

                <span className="product-name">
                  Networking Equipment
                </span>

                <span className="product-description">
                  Routers · Switches · Cables · Accessories
                </span>

                <ChevronRight size={20} />
              </Link>

              <Link
                to="/products?category=cctv"
                className="product-row"
              >
                <span className="product-index">02</span>

                <span className="product-name">
                  CCTV & Recording
                </span>

                <span className="product-description">
                  Cameras · NVR / DVR · Storage · Accessories
                </span>

                <ChevronRight size={20} />
              </Link>

              <Link
                to="/products?category=fibre"
                className="product-row"
              >
                <span className="product-index">03</span>

                <span className="product-name">
                  Fibre & FTTH
                </span>

                <span className="product-description">
                  Fibre equipment · Terminal boxes · Connectivity
                </span>

                <ChevronRight size={20} />
              </Link>

              <Link
                to="/products?category=access-security"
                className="product-row"
              >
                <span className="product-index">04</span>

                <span className="product-name">
                  Access & Security
                </span>

                <span className="product-description">
                  Access control · Security equipment
                </span>

                <ChevronRight size={20} />
              </Link>
            </div>

            <div className="product-note">
              <span>CAN'T FIND WHAT YOU NEED?</span>

              <a
                href={`https://wa.me/2348033883255?text=${productMessage}`}
                target="_blank"
                rel="noreferrer"
              >
                Ask us directly
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </section>

        {/* =========================
            ABOUT
        ========================= */}

        <section
          className="section about-section"
          id="about"
        >
          <div className="container about-grid">
            <div className="about-label">
              <span className="section-number">
                03 / BIZ-ETHICS
              </span>

              <div className="about-stamp">
                <span>BASED IN</span>
                <strong>LAGOS</strong>
              </div>
            </div>

            <div className="about-content">
              <h2>
                We make the
                <br />
                <em>technical stuff</em>
                <br />
                make sense.
              </h2>

              <p>
                We provide networking, surveillance and security
                equipment alongside the technical support to
                install, configure and maintain it.
              </p>

              <p>
                Whether you're connecting a home, setting up an
                office, securing a school or building infrastructure
                for a larger project, we help you choose the right
                equipment and put it to work.
              </p>

              <div className="about-points">
                <div>
                  <CheckCircle2 size={18} />
                  <span>Equipment supply</span>
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  <span>Professional installation</span>
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  <span>Technical troubleshooting</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            CONTACT CTA
        ========================= */}

        <section className="cta-section" id="contact">
          <div className="container cta-inner">
            <div>
              <span className="section-number">
                <span>04 / START A PROJECT</span>
              </span>

              <h2>
                Need a system
                <br />
                <em>that just works?</em>
              </h2>

              <p>
                Tell us what you're trying to build, fix or secure.
                We'll figure out the technical side.
              </p>
            </div>

            <div className="cta-actions">
              <a
                href={`https://wa.me/2348033883255?text=${projectMessage}`}
                target="_blank"
                rel="noreferrer"
                className="button button-light"
              >
                <MessageCircle size={18} />
                WhatsApp us
              </a>

              <a
                href="tel:08033883255"
                className="button button-outline-light"
              >
                <Phone size={18} />
                Call us
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* =========================
          FOOTER
      ========================= */}

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
              7, Otigba Street
              <br />
              Computer Village, Ikeja
              <br />
              Lagos, Nigeria
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

      {/* MOBILE WHATSAPP */}

      <a
        href={`https://wa.me/2348033883255?text=${generalMessage}`}
        target="_blank"
        rel="noreferrer"
        className="floating-whatsapp"
        aria-label="Chat with Biz-Ethics on WhatsApp"
      >
        <MessageCircle size={22} />
        <span>WhatsApp us</span>
      </a>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
    </Routes>
  );
}

export default App;