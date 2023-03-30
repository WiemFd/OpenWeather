import React from "react";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./Keycloak";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import WelcomePage from "./pages/Homepage";
import Form from "./pages/Securedpage";
import Header from './pages/header'
import PrivateRoute from "./helpers/PrivateRoute";
import "./App.css";

function App() {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{ checkLoginIframe: false }}
    >
      <div>
        <Nav />

        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<WelcomePage />} />
            <Route
              path="/secured"
              element={
                <PrivateRoute>
                  <Form />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </ReactKeycloakProvider>
  );
}

export default App;
