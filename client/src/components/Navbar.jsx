import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from "../images/logo.png";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState("");
  const [activeUsername, setActiveUsername] = useState(false);

  // Update active category and username based on URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get("cat");
    setActiveCategory(category || "");

    // Set activeUsername when the current user's page is active
    if (location.pathname === `/user/${currentUser?.username}`) {
      setActiveUsername(true);
    } else {
      setActiveUsername(false);
    }
  }, [location, currentUser]);

  const logoutNavbar = () => {
    logout();
    navigate("/login");
  };

  const categories = ["art", "science", "technology", "cinema", "design", "food"];

  return (
    <div className="navbar">
      <style>
        {`
          .category-link {
            position: relative;
            border-bottom: 1px solid #fcb78be;
          }

          .category-link::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: #fcb78b;
            transform: scaleX(0);
            transition: transform 0.3s ease;
          }

          .category-link.active::after {
            transform: scaleX(1);
          }

          .username-link {
            position: relative;
            border-bottom: 1px solid #fcb78be;
          }

          .username-link::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: #fcb78b;
            transform: scaleX(0);
            transition: transform 0.3s ease;
          }

          .username-link.active::after {
            transform: scaleX(1);
          }
        `}
      </style>
      <div className="container">
        <div className="logo">
          <a href="/">
            <img src={Logo} alt="logo" />
          </a>
        </div>
        <div className="links">
          {categories.map((cat) => (
            <Link
              key={cat}
              className={`link category-link ${activeCategory === cat ? "active" : ""}`}
              to={`/?cat=${cat}`}
            >
              <h6>{cat.toUpperCase()}</h6>
            </Link>
          ))}
          {currentUser ? (
            <>
              <Link
                className={`link username-link ${activeUsername ? "active" : ""}`}
                to={`/user/${currentUser.username}`}
              >
                {currentUser.username}
              </Link>
              <span onClick={logoutNavbar}>Logout</span>
            </>
          ) : (
            <Link className="link" to="/login">
              Login
            </Link>
          )}
          <span className="write">
            <Link className="link" to="/write">
              Write
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
