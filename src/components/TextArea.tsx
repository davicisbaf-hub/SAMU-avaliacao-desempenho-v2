import type { TextareaHTMLAttributes } from "react";

type Props = {
  titulo: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function TextArea({
  titulo,
  ...props
}: Props) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-2 gap-3 flex flex-col">
      <label className="text-[14px] font-semibold text-[#0e1216]">
        {titulo}
      </label>

      <textarea
        {...props}
        className="w-full bg-[#fcfcfc] border border-input rounded-lg px-3 py-2 text-sm text-foreground placeholder:[text-#555f69]/50 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}