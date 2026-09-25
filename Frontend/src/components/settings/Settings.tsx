import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export default function Settings() {
  const [profile, setProfile] = useState({
    fullName: "Omid Shabgard",
    email: "omid.shabgard@example.com",
    phone: "(518) 555-0142",
    address: "Albany, NY",
  });

  const [notifications, setNotifications] = useState({
    appointments: true,
    messages: true,
    testResults: true,
    billing: false,
  });

  const [privacy, setPrivacy] = useState({
    twoStep: false,
    activityAlerts: true,
  });

  const [saved, setSaved] = useState(false);

  const saveSettings = () => {
    localStorage.setItem(
      "carebridge_settings",
      JSON.stringify({ profile, notifications, privacy }),
    );

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="settings-page">
      <section className="settings-hero">
        <div>
          <small>ACCOUNT SETTINGS</small>
          <h2>Manage your preferences</h2>
          <p>
            Update your profile, notification preferences, and security
            settings.
          </p>
        </div>

        <span className="settings-shield">
          <ShieldCheck />
        </span>
      </section>

      {saved && (
        <div className="settings-success">
          <CheckCircle2 />
          Your settings have been saved.
        </div>
      )}

      <section className="settings-card">
        <div className="settings-card-heading">
          <span>
            <UserRound />
          </span>

          <div>
            <h3>Profile & contact</h3>
            <p>Manage your basic account information.</p>
          </div>
        </div>

        <div className="settings-form-grid">
          <label>
            Full name
            <div>
              <UserRound />
              <input
                value={profile.fullName}
                onChange={(event) =>
                  setProfile({
                    ...profile,
                    fullName: event.target.value,
                  })
                }
              />
            </div>
          </label>

          <label>
            Email
            <div>
              <Mail />
              <input
                type="email"
                value={profile.email}
                onChange={(event) =>
                  setProfile({
                    ...profile,
                    email: event.target.value,
                  })
                }
              />
            </div>
          </label>

          <label>
            Phone
            <div>
              <Phone />
              <input
                value={profile.phone}
                onChange={(event) =>
                  setProfile({
                    ...profile,
                    phone: event.target.value,
                  })
                }
              />
            </div>
          </label>

          <label>
            Address
            <div>
              <MapPin />
              <input
                value={profile.address}
                onChange={(event) =>
                  setProfile({
                    ...profile,
                    address: event.target.value,
                  })
                }
              />
            </div>
          </label>
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card-heading">
          <span>
            <Bell />
          </span>

          <div>
            <h3>Notifications</h3>
            <p>Choose which CareBridge updates you want to receive.</p>
          </div>
        </div>

        <div className="settings-options">
          <SettingToggle
            title="Appointment reminders"
            description="Receive reminders about upcoming appointments."
            checked={notifications.appointments}
            onChange={(checked) =>
              setNotifications({
                ...notifications,
                appointments: checked,
              })
            }
          />

          <SettingToggle
            title="New messages"
            description="Get notified when your care team sends a message."
            checked={notifications.messages}
            onChange={(checked) =>
              setNotifications({
                ...notifications,
                messages: checked,
              })
            }
          />

          <SettingToggle
            title="Test results"
            description="Receive an alert when new test results are available."
            checked={notifications.testResults}
            onChange={(checked) =>
              setNotifications({
                ...notifications,
                testResults: checked,
              })
            }
          />

          <SettingToggle
            title="Billing updates"
            description="Receive notifications about statements and balances."
            checked={notifications.billing}
            onChange={(checked) =>
              setNotifications({
                ...notifications,
                billing: checked,
              })
            }
          />
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card-heading">
          <span>
            <LockKeyhole />
          </span>

          <div>
            <h3>Security & privacy</h3>
            <p>Control additional account protection preferences.</p>
          </div>
        </div>

        <div className="settings-options">
          <SettingToggle
            title="Two-step verification"
            description="Require an additional verification step during sign in."
            checked={privacy.twoStep}
            onChange={(checked) =>
              setPrivacy({
                ...privacy,
                twoStep: checked,
              })
            }
          />

          <SettingToggle
            title="Sign-in activity alerts"
            description="Receive an alert when a new sign-in is detected."
            checked={privacy.activityAlerts}
            onChange={(checked) =>
              setPrivacy({
                ...privacy,
                activityAlerts: checked,
              })
            }
          />
        </div>
      </section>

      <div className="settings-save-area">
        <button className="settings-save-button" onClick={saveSettings}>
          <Save />
          Save changes
        </button>
      </div>
    </div>
  );
}

type SettingToggleProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function SettingToggle({
  title,
  description,
  checked,
  onChange,
}: SettingToggleProps) {
  return (
    <div className="settings-option">
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>

      <label className="settings-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />

        <span />
      </label>
    </div>
  );
}