import React from "react";
import { useKeycloak } from "@react-keycloak/web";

const Nav = () => {
  const { keycloak } = useKeycloak();

  const buttonStyles = {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const linkStyles = {
    padding: "10px",
    fontWeight: "bold",
    marginLeft: "10px",
    textDecoration: "none",
    color: "black"
  };

  const navStyles = {
    backgroundColor: "#f2f2f2",
    padding: "10px",
    margin: "0px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  };

  return (
    <nav style={navStyles}>
      <h1 style={{ color: "black", margin: 0 }}>Welcome To SkyCast</h1>
      <div style={{ display: "flex" }}>
        <a href="/" style={linkStyles}>
          Home
        </a>
        <a href="/secured" style={linkStyles}>
          Secured Page
        </a>
        {!keycloak.authenticated && (
          <button type="button" onClick={() => keycloak.login()} style={buttonStyles}>
            Login
          </button>
        )}
        {!!keycloak.authenticated && (
          <button type="button" onClick={() => keycloak.logout()} style={buttonStyles}>
            Logout ({keycloak.tokenParsed.preferred_username})
          </button>
        )}
      </div>
    </nav>
  );
};

export default Nav;
