import type { SvgIconComponent } from "@mui/icons-material";
import MuiIcon from "@/components/ui/MuiIcon";

export type MiniStatItem = {
  label: string;
  value: string;
  hint?: string;
  icon: SvgIconComponent;
};

type MiniStatsProps = {
  items: MiniStatItem[];
};

export default function MiniStats({ items }: MiniStatsProps) {
  return (
    <div className="mini-stats">
      {items.map((item) => (
        <article key={item.label} className="mini-stat bg-card">
          <div className="mini-stat__icon bg-primary-muted">
            <MuiIcon icon={item.icon} size={22} className="text-brand" />
          </div>
          <div>
            <p className="mini-stat__label text-secondary">{item.label}</p>
            <p className="mini-stat__value text-primary">{item.value}</p>
            {item.hint && (
              <p className="mini-stat__hint text-muted">{item.hint}</p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
