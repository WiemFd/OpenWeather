import React from "react";




const Nav = () => {
  
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
        padding: "10px",
        margin: "0px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      };
    
      return (
        <nav style={navStyles} className="nav">
          <h2 style={{ color: "white", margin: 0 , fontfamily: "sans-serif"}}>SkyCast</h2>
          <div style={{ display: "flex" }}>
            <a href="/" style={linkStyles}>
              Home
            </a>
            <a href="/secured" style={linkStyles}>
              Secured Page
            </a>
            
              <button type="button"  style={buttonStyles}>
                Login
              </button>
            
            
              <button type="button"  style={buttonStyles}>
                Logout 
              </button>

          </div>
        </nav>
      );
    };
    
    export default Nav;
