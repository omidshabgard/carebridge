import React from "react";
import ReactDOM from "react-dom/client";

import AuthShell from "./AuthShell";


import "./styles/global.css";
import "./styles/portal.css";
import "./styles/landing.css";
import "./styles/auth.css";
import "./styles/home-extras.css";
import "./styles/appointments.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthShell />
  </React.StrictMode>
);