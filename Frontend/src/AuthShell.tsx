import { useEffect, useState } from "react";

import App from "./App";
import AuthModal, {
  type AuthMode,
} from "./components/auth/AuthModal";
import HomeExtras from "./components/home/HomeExtras";

export default function AuthShell() {
  const [mode, setMode] = useState<AuthMode | null>(null);
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const requestAuth = () => {
      setMode("signin");
    };

    const syncPath = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener("carebridge-auth", requestAuth);
    window.addEventListener("popstate", syncPath);

    return () => {
      window.removeEventListener("carebridge-auth", requestAuth);
      window.removeEventListener("popstate", syncPath);
    };
  }, []);

  function enterPortal() {
    setMode(null);
    window.location.assign("/portal");
  }

  return (
    <>
      <App />

      {path !== "/portal" && <HomeExtras />}

      {mode && (
        <AuthModal
          initialMode={mode}
          onClose={() => setMode(null)}
          onSuccess={enterPortal}
        />
      )}
    </>
  );
}
