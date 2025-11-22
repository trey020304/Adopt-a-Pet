import React from "react";

export const Navigation = (props) => {
  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          <a className="navbar-brand page-scroll" href="#page-top">
            <img src="img/nav-logo.png" alt="logo" className="navbar-logo" />
            Adopt a Pet
          </a>{" "}
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="#features" className="page-scroll">
                Services
              </a>
            </li>
            <li>
              <a href="#about" className="page-scroll">
                About
              </a>
            </li>
            <li>
              <a href="#adoption" className="page-scroll">
                Adopt
              </a>
            </li>
            <li>
              <a href="#rescue-donate-section" className="page-scroll">
                Rescue & Donate
              </a>
            </li>
            <li>
              <a href="#team" className="page-scroll">
                Team
              </a>
            </li>
            <li>
              <a href="#contact" className="page-scroll">
                Contact
              </a>
            </li>
            <li>
              <a
                href="/login.html"
                title="Login/Register"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <i
                  className="fa fa-user"
                  style={{ fontSize: "22px" }}
                ></i>
                <span
                  style={{
                    fontWeight: 500,
                    fontSize: "15px",
                  }}
                >
                  Login/Register
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
