import React from "react";
import Logo from "../images/logo.png";
import "../style.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <img src={Logo} alt="logo" className="footer-logo" />
        <div className="footer-text">
          <p>Made with ♥️ by <b><a href="https://www.xodivorce.in" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'black' }}>@xodivorce</a></b></p>
          <p>&copy; 2025 All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
