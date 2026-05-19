import type { SvgIconComponent } from "@mui/icons-material";

type MuiIconProps = {
  icon: SvgIconComponent;
  size?: number;
  className?: string;
};

/** Ícone Material UI Outlined — tamanho e cor herdados do elemento pai. */
export default function MuiIcon({
  icon: Icon,
  size = 20,
  className,
}: MuiIconProps) {
  return (
    <Icon
      className={className}
      style={{ fontSize: size, width: size, height: size, color: "inherit" }}
      aria-hidden
    />
  );
}
