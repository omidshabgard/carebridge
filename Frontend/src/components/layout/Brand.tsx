import { HeartPulse } from "lucide-react";

type BrandProps = {
  onClick: () => void;
  className?: string;
};

export default function Brand({
  onClick,
  className = "logo",
}: BrandProps) {
  return (
    <button
      className={className}
      onClick={onClick}
      aria-label="Go to CareBridge home"
    >
      <HeartPulse />

      <b>
        Care<span>Bridge</span>
      </b>
    </button>
  );
}