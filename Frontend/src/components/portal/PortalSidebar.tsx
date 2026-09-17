import { ShieldCheck, X } from "lucide-react";

import type { Section } from "../../types";
import { nav } from "../../data/portalData";
import Brand from "../layout/Brand";

type PortalSidebarProps = {
  active: Section;
  mobile: boolean;
  goHome: () => void;
  onClose: () => void;
  onSectionChange: (section: Section) => void;
};

export default function PortalSidebar({
  active,
  mobile,
  goHome,
  onClose,
  onSectionChange,
}: PortalSidebarProps) {
  return (
    <aside className={mobile ? "sidebar open" : "sidebar"}>
      <button className="close" onClick={onClose}>
        <X />
      </button>

      <Brand onClick={goHome} />

      <div className="patient">
        <span>OS</span>

        <div>
          <b>Omid Shabgard</b>
          <small>Patient ID • 08421</small>
        </div>
      </div>

      <nav>
        {nav.map(({ name, icon: Icon, badge, color }) => (
          <button
            key={name}
            className={active === name ? `active ${color}` : ""}
            onClick={() => onSectionChange(name)}
          >
            <Icon />
            <span>{name}</span>

            {badge && <i>{badge}</i>}
          </button>
        ))}
      </nav>

      <div className="secure">
        <ShieldCheck />

        <div>
          <b>Your information is protected</b>
          <small>Secure & encrypted</small>
        </div>
      </div>
    </aside>
  );
}