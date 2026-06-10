type FichasCardProps = {
  icon: string;
  cargo: string;
  criterios: number;
  tags: string[];
  link: string;
};

export default function FichasCard({
  icon,
  cargo,
  criterios,
  tags,
  link
}: FichasCardProps) {
  return (
    <a
      href={link}
      className="block bg-[#f6f6f6] border border-border border-[#d2d8de] rounded-xl p-5 hover:border-[#cd0048]/40 hover:shadow-md transition-all group"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#0e1216] text-left text-sm group-hover:text-[#cd0048] transition-colors">
            {cargo}
          </p>

          <p className="text-xs [text-#555f69] mt-1 text-left">
            {criterios} critérios de avaliação
          </p>
        </div>

        <span className="[text-#555f69] group-hover:text-[#cd0048] transition-colors text-lg">
          →
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-[#e5ecf1] [text-#555f69] px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </a>
  );
}