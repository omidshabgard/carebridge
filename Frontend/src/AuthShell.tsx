import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";

import App from "./App";
import AuthModal, {
  type AuthMode,
} from "./components/auth/AuthModal";
import HomeExtras from "./components/home/HomeExtras";

export default function AuthShell() {
  const [mode, setMode] = useState<AuthMode | null>(null);
  const [path, setPath] = useState(window.location.pathname);

  const signedIn = Boolean(
    localStorage.getItem("carebridge_token")
  );

  useEffect(() => {
    const requestAuth = () => {
      setMode("signin");
    };

    const syncPath = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener(
      "carebridge-auth",
      requestAuth
    );

    window.addEventListener(
      "popstate",
      syncPath
    );

    return () => {
      window.removeEventListener(
        "carebridge-auth",
        requestAuth
      );

      window.removeEventListener(
        "popstate",
        syncPath
      );
    };
  }, []);

  function enterPortal() {
    setMode(null);
    window.location.assign("/portal");
  }

  function signOut() {
    localStorage.removeItem("carebridge_token");
    localStorage.removeItem("carebridge_user");

    window.location.assign("/");
  }

  const onPortal =
    path === "/portal" && signedIn;

  return (
    <>
      <App />

      {!onPortal && (
        <button
          className="signin-shortcut"
          onClick={() => setMode("signin")}
        >
          Sign in
        </button>
      )}

      {onPortal && (
        <button
          className="signout-button"
          onClick={signOut}
        >
          <LogOut />
          Sign out
        </button>
      )}

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