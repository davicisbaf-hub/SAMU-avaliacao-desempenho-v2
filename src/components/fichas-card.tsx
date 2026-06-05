type FichasCardProps = {
  cargo: string;
  criterios: number;
  tags: string[];
};

export default function FichasCard({
  cargo,
  criterios,
  tags,
}: FichasCardProps) {
  return (
    <a
      href="#"
      className="block bg-card border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-md transition-all group"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">🚑</span>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-card-foreground text-left text-sm group-hover:text-primary transition-colors">
            {cargo}
          </p>

          <p className="text-xs text-muted-foreground mt-1 text-left">
            {criterios} critérios de avaliação
          </p>
        </div>

        <span className="text-muted-foreground group-hover:text-primary transition-colors text-lg">
          →
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </a>
  );
}