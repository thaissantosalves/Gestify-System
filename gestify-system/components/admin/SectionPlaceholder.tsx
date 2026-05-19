type SectionPlaceholderProps = {
  items: string[];
};

export default function SectionPlaceholder({
  items,
}: SectionPlaceholderProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article key={item} className="admin-card">
          <span className="admin-card__badge">Em breve</span>
          <p className="text-primary text-base font-medium">{item}</p>
          <p className="text-secondary mt-1 text-sm">
            Módulo em desenvolvimento
          </p>
        </article>
      ))}
    </div>
  );
}
