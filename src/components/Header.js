import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import { getAuth, signOut } from "firebase/auth";

function Header({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [hideHeader, setHideHeader] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerClass, setHeaderClass] = useState("default-header");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Add scrolled class when not at the top
      setScrolled(currentScrollY > 20);

      if (currentScrollY === 0) {
        setHideHeader(false);
      } else if (currentScrollY > lastScrollY) {
        setHideHeader(true);
      } else {
        setHideHeader(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close menu when route changes
    setMenuOpen(false);
    
    // Update headerClass based on pathname
    if (location.pathname === "/") {
      setHeaderClass("home-header");
    } else if (location.pathname === "/login") {
      setHeaderClass("login-header");
    } else if (location.pathname === "/recipes") {
      setHeaderClass("trip-header");
    } else if (location.pathname === "/meal-planner") {
      setHeaderClass("form-header");
    }else if (location.pathname === "/pantry") {
      setHeaderClass("formal-header");
    } else {
      setHeaderClass("default-header");
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      localStorage.removeItem("loggedIn");
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Add body scroll lock when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  return (
    <header className={`sticky-header ${headerClass} ${hideHeader ? "hide" : ""} ${scrolled ? "scrolled" : ""}`}>
      <div className="logo">
        <Link className="name" to="/">Dishcovery</Link>
      </div>
      
      <button className="menu-button" onClick={toggleMenu} aria-label="Toggle menu">
        {menuOpen ? '×' : '☰'}
      </button>
      
      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link className="button-link" to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        {isLoggedIn ? (
          <>
            <Link className="button-link" to="/create-recipe" onClick={() => setMenuOpen(false)}>
              Create Recipe
            </Link>
            <Link className="button-link" to="/recipes" onClick={() => setMenuOpen(false)}>
              Recipes
            </Link>
            <Link className="button-link" to="/meal-planner" onClick={() => setMenuOpen(false)}>
              Meal Planner
            </Link>
            <Link className="button-link" to="/pantry" onClick={() => setMenuOpen(false)}>
              Pantry
            </Link>
            <Link
              className="button-link1"
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
            >
              Logout
            </Link>
          </>
        ) : (
          <Link className="button-link1" to="/login" onClick={() => setMenuOpen(false)}>
            Login/Sign Up
          </Link>
        )}
      </nav>
      
      {menuOpen && <div className="menu-backdrop" onClick={toggleMenu}></div>}
    </header>
  );
}

export default Header;