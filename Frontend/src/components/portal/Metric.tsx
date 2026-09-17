import { Activity, Check } from "lucide-react";

type MetricProps = {
  title: string;
  value: string;
  unit: string;
  tone: string;
  icon: typeof Activity;
};

export default function Metric({
  title,
  value,
  unit,
  tone,
  icon: Icon,
}: MetricProps) {
  return (
    <article className="metric">
      <span className={tone}>
        <Icon />
      </span>

      <div>
        <small>{title}</small>

        <strong>
          {value}
          <em>{unit}</em>
        </strong>

        <p>
          <Check />
          Within your range
        </p>
      </div>
    </article>
  );
}