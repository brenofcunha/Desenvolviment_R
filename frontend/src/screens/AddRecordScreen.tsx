import { useState, useRef } from "react";
import type { Goal } from "../types";
import { saveGoal } from "../store";

interface Props {
  goal: Goal;
  onBack: () => void;
  onRecordAdded: (updatedGoal: Goal) => void;
}

const CAT_COLORS: Record<string, string> = {
  saude: "#00A884", carreira: "#3B82F6", financas: "#F59E0B",
  estudos: "#8B5CF6", pessoal: "#EC4899", viagem: "#06B6D4",
  hobby: "#F97316", outro: "#6B7280",
};

function goalInitials(title: string) {
  return title.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

function IconBack() {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconAttach() {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconCamera() {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}
function IconSend() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 2L15 22l-4-9-9-4 19-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconX() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function AddRecordScreen({ goal, onBack, onRecordAdded }: Props) {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const color = CAT_COLORS[goal.category] ?? "#6B7280";
  const initials = goalInitials(goal.title);
  const canSend = text.trim().length > 0 || imageUrl !== null;

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleSend() {
    if (!canSend) return;
    setSaving(true);
    setTimeout(() => {
      const record = {
        id: crypto.randomUUID(),
        goalId: goal.id,
        text: text.trim(),
        imageUrl: imageUrl || undefined,
        createdAt: new Date().toISOString(),
      };
      const updated = { ...goal, records: [...goal.records, record] };
      saveGoal(updated);
      onRecordAdded(updated);
    }, 300);
  }

  return (
    <div className="flex flex-col h-dvh screen-enter" style={{ background: "#0B141A" }}>

      {/* Header */}
      <div style={{ background: "#1F2C34" }} className="flex-shrink-0 pt-12">
        <div className="flex items-center gap-3 px-4 pb-3">
          <button onClick={onBack} className="text-[#AEBAC1] flex-shrink-0 -ml-1">
            <IconBack />
          </button>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: color }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#E9EDEF] font-semibold text-[15px] truncate">{goal.title}</p>
            <p className="text-[#8696A0] text-xs">Adicionar registro</p>
          </div>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-3">

        {/* Image preview */}
        {imageUrl && (
          <div className="flex justify-end pl-12 fade-in">
            <div className="relative rounded-2xl rounded-tr-sm overflow-hidden" style={{ background: "#005C4B" }}>
              <img src={imageUrl} alt="Preview" className="max-h-56 object-cover w-full"/>
              <button
                onClick={() => { setImageUrl(null); if (fileRef.current) fileRef.current.value = ""; }}
                className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white"
              >
                <IconX />
              </button>
            </div>
          </div>
        )}

        {/* Text preview bubble */}
        {text.trim() && (
          <div className="flex justify-end pl-12 fade-in">
            <div className="rounded-2xl rounded-tr-sm px-3.5 py-2.5" style={{ background: "#005C4B" }}>
              <p className="text-sm text-[#E9EDEF] whitespace-pre-wrap leading-relaxed">{text}</p>
              <p className="text-[10px] text-[#8696A0] mt-1 text-right">agora</p>
            </div>
          </div>
        )}

        {!imageUrl && !text.trim() && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-16">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: color + "20" }}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-[#8696A0] text-sm">Escreva um texto ou adicione uma foto</p>
          </div>
        )}

        <div className="flex-1" />
      </div>

      {/* Input bar */}
      <div
        className="flex-shrink-0 flex items-end gap-2 px-3 py-3"
        style={{ background: "#1F2C34" }}
      >
        <div
          className="flex-1 flex items-end gap-2 rounded-3xl px-4 py-2.5"
          style={{ background: "#2A3942" }}
        >
          <button
            onClick={() => fileRef.current?.click()}
            className="text-[#8696A0] flex-shrink-0 mb-0.5 hover:text-[#E9EDEF] transition-colors"
          >
            <IconAttach />
          </button>

          <textarea
            ref={textRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Novo registro..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-[#E9EDEF] placeholder-[#8696A0] focus:outline-none resize-none leading-relaxed py-0.5"
            style={{ maxHeight: "96px", overflowY: "auto" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 96) + "px";
            }}
          />

          <button
            onClick={() => fileRef.current?.click()}
            className="text-[#8696A0] flex-shrink-0 mb-0.5 hover:text-[#E9EDEF] transition-colors"
          >
            <IconCamera />
          </button>
        </div>

        <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden"/>

        <button
          onClick={handleSend}
          disabled={!canSend || saving}
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg transition-all active:scale-95 disabled:opacity-40"
          style={{ background: canSend ? "#00A884" : "#2A3942" }}
        >
          {saving
            ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
            : <IconSend />}
        </button>
      </div>
    </div>
  );
}
