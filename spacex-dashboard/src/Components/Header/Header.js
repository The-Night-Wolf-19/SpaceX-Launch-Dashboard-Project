import React from "react";
import hlogo from "../../logo.png";
import "./Header.css";

const Header = () => {
  return (
    <div>
      <div className="header col-12">
        <a
          href="https://www.spacex.com/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <img className="header-logo" src={hlogo} alt="SpaceX"></img>
        </a>
      </div>
      <hr></hr>
    </div>
  );
};

export default Header;
