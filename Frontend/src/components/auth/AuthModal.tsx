import { FormEvent, useState } from "react";
import {
  ArrowRight,
  HeartPulse,
  ShieldCheck,
  X,
} from "lucide-react";
import { api } from "../../api";

export type AuthMode = "signin" | "signup";

type AuthResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    role: string;
  };
};

type AuthModalProps = {
  initialMode: AuthMode;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AuthModal({
  initialMode,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(
    "https://i.pravatar.cc/150?img=12"
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();

    setBusy(true);
    setError("");

    try {
      const body =
        mode === "signup"
          ? {
              name,
              email,
              password,
              avatarUrl,
            }
          : {
              email,
              password,
            };

      const result = await api<AuthResponse>(
        `/auth/${mode === "signup" ? "signup" : "login"}`,
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );

      localStorage.setItem("carebridge_token", result.token);
      localStorage.setItem(
        "carebridge_user",
        JSON.stringify(result.user)
      );

      onSuccess();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "We could not complete your request."
      );
    } finally {
      setBusy(false);
    }
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
  }

  return (
    <div
      className="auth-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <form className="auth-modal" onSubmit={submit}>
        <button
          type="button"
          className="auth-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X />
        </button>

        <span className="auth-symbol">
          <HeartPulse />
        </span>

        <small>SECURE PATIENT ACCESS</small>

        <h2>
          {mode === "signup"
            ? "Create your CareBridge account"
            : "Welcome back"}
        </h2>

        <p>
          {mode === "signup"
            ? "Your care, appointments, and records in one protected place."
            : "Sign in to open your personal health dashboard."}
        </p>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === "signin" ? "selected" : ""}
            onClick={() => switchMode("signin")}
          >
            Sign in
          </button>

          <button
            type="button"
            className={mode === "signup" ? "selected" : ""}
            onClick={() => switchMode("signup")}
          >
            Sign up
          </button>
        </div>

        {mode === "signup" && (
          <label>
            Full name
            <input
              required
              minLength={2}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Omid Shabgard"
            />
          </label>
        )}

        <label>
          Email address
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />
        </label>

        <label>
          Password
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
          />
        </label>

        {mode === "signup" && (
          <label>
            Avatar URL
            <input
              required
              type="url"
              value={avatarUrl}
              onChange={(event) =>
                setAvatarUrl(event.target.value)
              }
              placeholder="https://example.com/avatar.jpg"
            />
          </label>
        )}

        {error && <div className="auth-error">{error}</div>}

        <button
          className="auth-submit"
          disabled={busy}
        >
          {busy
            ? "Please wait…"
            : mode === "signup"
            ? "Create account"
            : "Sign in"}

          <ArrowRight />
        </button>

        <div className="auth-security">
          <ShieldCheck />
          Encrypted and protected patient access
        </div>
      </form>
    </div>
  );
}