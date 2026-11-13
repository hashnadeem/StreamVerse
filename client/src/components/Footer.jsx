import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="sv-footer">
      <div className="container sv-footer-inner">
        <div className="sv-footer-brand">
          <Link to="/" className="brand-logo">
            STREAM<span>VERSE</span>
          </Link>
          <p>
            A full-stack MERN video streaming platform featuring multi-profile personalization,
            Kids safety filtering, HTTP range-request streaming, and dynamic library management.
          </p>
        </div>

        <div className="sv-footer-links">
          <div>
            <h4>Navigation</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/browse">Browse Catalogue</Link>
              </li>
              <li>
                <Link to="/my-list">My List</Link>
              </li>
              <li>
                <Link to="/plans">Subscription Plans</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Account</h4>
            <ul>
              <li>
                <Link to="/profiles">Switch Profiles</Link>
              </li>
              <li>
                <Link to="/admin">Admin Studio</Link>
              </li>
              <li>
                <Link to="/login">Sign In</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>Project Team (BDS-7A)</h4>
            <ul>
              <li>Haris Hassaan (23L-2642)</li>
              <li>Hashir Nadeem (23L-2544)</li>
              <li>Web Programming — MERN Stack</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="sv-footer-bottom container">
        <span>© 2026 StreamVerse Inc. Built with React, Node.js, Express & MongoDB.</span>
      </div>
    </footer>
  );
};

export default Footer;

