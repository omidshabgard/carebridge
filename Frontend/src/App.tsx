import { useEffect, useState } from "react";

import Landing from "./components/landing/Landing";
import Portal from "./components/portal/Portal";

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const sync = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", sync);

    return () => {
      window.removeEventListener("popstate", sync);
    };
  }, []);

  const navigate = (next: string) => {
    window.history.pushState({}, "", next);
    setPath(next);
    window.scrollTo(0, 0);
  };

  const signedIn = Boolean(
    localStorage.getItem("carebridge_token"),
  );

  const signOut = () => {
    localStorage.removeItem("carebridge_token");
    localStorage.removeItem("carebridge_user");
    window.location.assign("/");
  };

  if (path === "/portal" && !signedIn) {
    window.history.replaceState({}, "", "/");

    return (
      <Landing
        signedIn={false}
        signOut={signOut}
        goPortal={() =>
          window.dispatchEvent(
            new Event("carebridge-auth"),
          )
        }
      />
    );
  }

  return path === "/portal" ? (
    <Portal goHome={() => navigate("/")} />
  ) : (
    <Landing
      signedIn={signedIn}
      signOut={signOut}
      goPortal={() =>
        signedIn
          ? navigate("/portal")
          : window.dispatchEvent(
              new Event("carebridge-auth"),
            )
      }
    />
  );
}