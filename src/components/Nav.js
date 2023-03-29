import React from "react";
import { useKeycloak } from "@react-keycloak/web";



const Nav = () => {
  const { keycloak } = useKeycloak();

  const navStyles = {
    backgroundColor: "#f2f2f2",
    padding: "10px",
    margin: "5px",
  };

  const ulStyles = {
    listStyleType: "none",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const liStyles = {
    padding: "10px",
  };

  const buttonStyles = {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    cursor: "pointer",
  };

  return (
    <div>
      <div style={navStyles}>
        <section>
          <nav>
            <div>
            <h1 style={{ color: "black" }}>Keycloak React AUTH</h1>
              <ul style={ulStyles}>
                <li style={liStyles}>
                  <a href="/">Home</a>
                </li>
                <li style={liStyles}>
                  <a href="/secured">Secured Page</a>
                </li>
                <li style={liStyles}>
                  {!keycloak.authenticated && (
                    <button
                      type="button"
                      onClick={() => keycloak.login()}
                      style={buttonStyles}
                    >
                      Login
                    </button>
                  )}
                  {!!keycloak.authenticated && (
                    <button
                      type="button"
                      onClick={() => keycloak.logout()}
                      style={buttonStyles}
                    >
                      Logout ({keycloak.tokenParsed.preferred_username})
                    </button>
                  )}
                </li>
              </ul>
            </div>
          </nav>
        </section>
      </div>
    </div>
  );
};

export default Nav;
