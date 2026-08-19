import { useState } from "react";
import type { Goal, User } from "../types";
import { deleteGoal, saveGoal } from "../store";

interface Props {
  goal: Goal;
  user: User;
  onBack: () => void;
  onAddRecord: () => void;
  onGoalUpdated: (goal: Goal) => void;
  onDelete: () => void;
}

const CAT_COLORS: Record<string, string> = {
  saude: "#1C9C8F",
  carreira: "#2F8DE4",
  financas: "#D4891E",
  estudos: "#5E71D8",
  pessoal: "#CA4D8A",
  viagem: "#2F9AA7",
  hobby: "#D36F2B",
  outro: "#758196",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function groupByDay(records: Goal["records"]) {
  const map = new Map<string, Goal["records"]>();
  for (const r of records) {
    const day = new Date(r.createdAt).toDateString();
    if (!map.has(day)) map.set(day, []);
    map.get(day)!.push(r);
  }

  return Array.from(map.entries()).map(([day, recs]) => ({
    label: new Date(day).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    records: recs,
  }));
}

function goalInitials(title: string) {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function IconBack() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconDots() {
  return (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}

function IconAttach() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path d="M21 12.5l-8.5 8.5a5 5 0 01-7.1-7.1l8.5-8.5a3.5 3.5 0 115 5L10.4 19a2 2 0 11-2.8-2.8l7.8-7.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCamera() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h3l2-2h6l2 2h3a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function IconMic() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
      <rect x="9" y="4" width="6" height="11" rx="3" stroke="white" strokeWidth="2" />
      <path d="M6 11a6 6 0 0012 0M12 17v3" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function GoalDetailScreen({ goal: initialGoal, onBack, onAddRecord, onGoalUpdated, onDelete }: Props) {
  const [goal, setGoal] = useState(initialGoal);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const sortedRecords = [...goal.records].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const groups = groupByDay(sortedRecords);
  const color = CAT_COLORS[goal.category] ?? "#758196";

  function toggleCompleted() {
    const updated = { ...goal, completed: !goal.completed };
    setGoal(updated);
    saveGoal(updated);
    onGoalUpdated(updated);
    setShowMenu(false);
  }

  function handleDelete() {
    deleteGoal(goal.id);
    onDelete();
  }

  return (
    <div className="flex flex-col h-dvh bg-[#ECE5DD]">
      <div className="bg-[#138F83] pt-11 pb-3 px-3.5 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <button onClick={onBack} className="w-8 h-8 rounded-full text-white/95 flex items-center justify-center hover:bg-white/15">
            <IconBack />
          </button>

          <div className="w-10 h-10 rounded-full text-white font-bold text-sm flex items-center justify-center" style={{ background: color }}>
            {goalInitials(goal.title)}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white text-[18px] leading-5 font-semibold truncate">{goal.title}</p>
            <p className="text-white/80 text-xs mt-0.5">
              {goal.completed ? "Concluída" : "Em progresso"} · {goal.records.length} registros
            </p>
          </div>

          <div className="relative">
            <button onClick={() => setShowMenu((v) => !v)} className="w-8 h-8 rounded-full text-white/95 flex items-center justify-center hover:bg-white/15">
              <IconDots />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-10 bg-white rounded-xl border border-[#E5EAF0] shadow-xl py-1 w-52 z-50">
                <button onClick={toggleCompleted} className="w-full text-left px-4 py-2.5 text-sm text-[#102537] hover:bg-[#F4F7F9]">
                  {goal.completed ? "Reativar meta" : "Marcar como concluída"}
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowDeleteConfirm(true);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-[#C53939] hover:bg-[#F4F7F9]"
                >
                  Excluir meta
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2.5 py-3">
        <div className="flex justify-center my-2">
          <span className="text-[11px] text-white bg-[#2B4255] px-3 py-1 rounded-full">Meta criada em {fmtDate(goal.createdAt)}</span>
        </div>

        <div className="flex justify-start mb-2 pr-12">
          <div className="bg-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-sm border border-[#E5EAF0]">
            <p className="text-[#138F83] text-xs font-bold">MetaChat</p>
            <p className="text-sm text-[#102537] mt-1 leading-relaxed">
              Registre sua evolução nesta conversa. Cada atualização ajuda a visualizar o progresso.
            </p>
            {goal.description && <p className="text-sm text-[#6A7A8A] mt-1">{goal.description}</p>}
            <p className="text-[10px] text-[#8DA0B1] text-right mt-1">{fmtTime(goal.createdAt)}</p>
          </div>
        </div>

        {groups.map(({ label, records }) => (
          <div key={label}>
            <div className="flex justify-center my-3">
              <span className="text-[11px] text-white bg-[#2B4255] px-3 py-1 rounded-full">{label}</span>
            </div>

            {records.map((record) => (
              <div key={record.id} className="flex justify-end pl-12 mb-2">
                <div className="bg-[#DCF6D9] rounded-2xl rounded-tr-sm px-3.5 py-2.5 shadow-sm border border-[#CAE9C6] max-w-full">
                  {record.imageUrl && (
                    <button onClick={() => setLightboxImg(record.imageUrl!)} className="block mb-2 rounded-xl overflow-hidden">
                      <img src={record.imageUrl} alt="Registro" className="w-full max-h-56 object-cover" />
                    </button>
                  )}
                  {record.text && <p className="text-sm text-[#102537] whitespace-pre-wrap">{record.text}</p>}
                  <p className="text-[10px] text-[#6A7A8A] text-right mt-1">{fmtTime(record.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        ))}

        {goal.completed && (
          <div className="flex justify-center mt-3">
            <span className="text-[11px] text-[#138F83] bg-white border border-[#CFE7E4] px-3 py-1 rounded-full">Meta concluída</span>
          </div>
        )}
      </div>

      <div className="bg-[#EFF2F5] px-2.5 py-2.5 flex items-end gap-2 border-t border-[#DCE3EA] flex-shrink-0">
        <div className="flex-1 bg-white rounded-full border border-[#DCE3EA] px-3 py-2.5 flex items-center gap-2">
          <button className="text-[#7A8FA5]">
            <IconAttach />
          </button>
          <button onClick={onAddRecord} className="flex-1 text-left text-sm text-[#7A8FA5]">
            Novo registro...
          </button>
          <button className="text-[#7A8FA5]">
            <IconCamera />
          </button>
        </div>

        <button onClick={onAddRecord} className="w-11 h-11 rounded-full bg-[#24C269] flex items-center justify-center shadow-md">
          <IconMic />
        </button>
      </div>

      {lightboxImg && (
        <div className="fixed inset-0 bg-black/90 z-50 p-4 flex items-center justify-center" onClick={() => setLightboxImg(null)}>
          <img src={lightboxImg} alt="Registro ampliado" className="max-w-full max-h-full rounded-xl object-contain" />
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/45 z-50 flex items-end justify-center">
          <div className="w-full max-w-[430px] bg-white rounded-t-3xl px-5 py-6">
            <h3 className="text-[#102537] text-lg font-semibold">Excluir esta meta?</h3>
            <p className="text-sm text-[#6A7A8A] mt-2">Todos os registros serão removidos permanentemente.</p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 h-11 rounded-xl bg-[#EEF2F6] text-[#102537] font-semibold">
                Cancelar
              </button>
              <button onClick={handleDelete} className="flex-1 h-11 rounded-xl bg-[#C53939] text-white font-semibold">
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {showMenu && <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />}
    </div>
  );
}
