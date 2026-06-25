import { useState, useRef } from "react";

type ParItem = { id: number; nome: string; funcao: string };

export default function MultiSelectPar({
  usuarios,
  value,
  onChange,
  dropUp = false,
}: {
  usuarios: { id: number; nome: string; funcao: string }[];
  value: ParItem[];
  onChange: (v: ParItem[]) => void;
  dropUp?: boolean;
}) {
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtrados = usuarios.filter((u) =>
    u.nome.toLowerCase().includes(busca.toLowerCase())
  );

  function toggle(u: ParItem) {
    if (value.some((s) => s.id === u.id)) {
      onChange(value.filter((s) => s.id !== u.id));
    } else {
      onChange([...value, u]);
    }
  }

  return (
    <div className="relative w-full">
      <div
        className="min-h-[38px] border rounded-lg px-2 py-1 flex flex-wrap gap-1 items-center cursor-text focus-within:ring-2 focus-within:ring-blue-300"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((u) => (
          <span key={u.id} className="flex items-center gap-1 bg-gray-100 border rounded-md px-2 py-0.5 text-xs">
            {u.nome}
            <button type="button" onClick={() => toggle(u)} className="text-gray-400 hover:text-black">×</button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={busca}
          onChange={(e) => { setBusca(e.target.value); setFocusedIdx(-1); }}
          onFocus={() => setAberto(true)}
          onBlur={() => setTimeout(() => setAberto(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setFocusedIdx((i) => Math.min(i + 1, filtrados.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setFocusedIdx((i) => Math.max(i - 1, 0)); }
            else if (e.key === "Enter" && focusedIdx >= 0) { e.preventDefault(); toggle(filtrados[focusedIdx]); }
            else if (e.key === "Escape") setAberto(false);
            else if (e.key === "Backspace" && busca === "" && value.length > 0) onChange(value.slice(0, -1));
          }}
          placeholder={value.length === 0 ? "Selecione o par..." : ""}
          className="border-none outline-none bg-transparent text-sm flex-1 min-w-[120px] p-0.5"
        />
      </div>

      {aberto && (
        <div className={`absolute ${dropUp ? "bottom-full mb-1" : "top-full mt-1"} left-0 right-0 bg-white border rounded-lg z-50 max-h-48 overflow-y-auto shadow-sm`}>
          {filtrados.length === 0 ? (
            <p className="text-xs text-gray-400 p-3">Nenhum resultado</p>
          ) : filtrados.map((u, i) => {
            const sel = value.some((s) => s.id === u.id);
            return (
              <div
                key={u.id}
                onMouseDown={(e) => { e.preventDefault(); toggle(u); }}
                className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer
                  ${i === focusedIdx ? "bg-gray-100" : "hover:bg-gray-50"}
                  ${sel ? "text-blue-600" : ""}`}
              >
                <span>{u.nome} <span className="text-xs text-gray-400">{u.funcao}</span></span>
                {sel && <span>✓</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}