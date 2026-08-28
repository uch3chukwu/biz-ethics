import {
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleHome = () => {
    closeMenu();

    if (location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    navigate("/");
  };

  const handleSection = (id) => {
    closeMenu();

    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }

    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <button
          className="brand"
          onClick={handleHome}
          aria-label="Biz-Ethics home"
        >
          <span className="brand-mark">B</span>

          <span className="brand-name">
            BIZ<span>-</span>ETHICS
          </span>
        </button>

        <nav
          className={`nav-links ${
            menuOpen ? "nav-open" : ""
          }`}
        >
          <button onClick={handleHome}>
            Home
          </button>

          <button
            onClick={() => handleSection("about")}
          >
            About
          </button>

          <button
            onClick={() => handleSection("solutions")}
          >
            Solutions
          </button>

          <Link
            to="/products"
            onClick={closeMenu}
          >
            Products
          </Link>

          <button
            className="nav-contact"
            onClick={() => handleSection("contact")}
          >
            Contact
            <ArrowUpRight size={16} />
          </button>
        </nav>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>
    </header>
  );
}

export default Navbar;