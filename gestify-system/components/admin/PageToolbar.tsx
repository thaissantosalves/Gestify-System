"use client";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import MuiIcon from "@/components/ui/MuiIcon";

type PageToolbarProps = {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  actionLabel?: string;
  onAction?: () => void;
};

export default function PageToolbar({
  searchPlaceholder = "Buscar...",
  searchValue,
  onSearchChange,
  actionLabel = "Novo",
  onAction,
}: PageToolbarProps) {
  return (
    <div className="page-toolbar">
      <input
        type="search"
        className="page-toolbar__search bg-input text-primary"
        placeholder={searchPlaceholder}
        aria-label="Buscar"
        value={searchValue}
        onChange={(e) => onSearchChange?.(e.target.value)}
      />
      <button type="button" className="btn-primary" onClick={onAction}>
        <MuiIcon icon={AddOutlinedIcon} size={18} />
        {actionLabel}
      </button>
    </div>
  );
}
