import { useEffect, useState } from "react";
import type { Goal, User } from "../types";
import { getGoals } from "../store";

interface Props {
  user: User;
  onLogout: () => void;
  onOpenGoal: (goal: Goal) => void;
  onCreateGoal: () => void;
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

function goalColor(goal: Goal) {
  return CAT_COLORS[goal.category] ?? "#758196";
}

function goalInitials(title: string) {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "hoje";
  if (days === 1) return "ontem";
  if (days < 7) return ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"][d.getDay()];
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function IconSearch() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

function IconTabGoals({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8.5" stroke={active ? "#138F83" : "#90A0B4"} strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke={active ? "#138F83" : "#90A0B4"} strokeWidth="2" />
    </svg>
  );
}

function IconTabProgress({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path d="M4 16l4-4 3 3 5-6 4 4" stroke={active ? "#138F83" : "#90A0B4"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 20h16" stroke={active ? "#138F83" : "#90A0B4"} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconTabProfile({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" stroke={active ? "#138F83" : "#90A0B4"} strokeWidth="2" />
      <path d="M4.5 20a7.5 7.5 0 0115 0" stroke={active ? "#138F83" : "#90A0B4"} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function ProgressTab({ user }: { user: User }) {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    setGoals(getGoals(user.id));
  }, [user.id]);

  const completed = goals.filter((g) => g.completed).length;
  const totalRecords = goals.reduce((sum, g) => sum + g.records.length, 0);

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 bg-[#F4F7F9]">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-[#E5EAF0]">
          <p className="text-xs text-[#6A7A8A] uppercase">Metas</p>
          <p className="text-2xl font-bold text-[#102537] mt-1">{goals.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#E5EAF0]">
          <p className="text-xs text-[#6A7A8A] uppercase">Concluídas</p>
          <p className="text-2xl font-bold text-[#102537] mt-1">{completed}</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-4 border border-[#E5EAF0] mt-3">
        <p className="text-xs text-[#6A7A8A] uppercase">Registros totais</p>
        <p className="text-2xl font-bold text-[#102537] mt-1">{totalRecords}</p>
      </div>
    </div>
  );
}

function ProfileTab({ user, onLogout }: { user: User; onLogout: () => void }) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex-1 overflow-y-auto px-4 pt-5 pb-24 bg-[#F4F7F9]">
      <div className="bg-white rounded-3xl p-6 border border-[#E5EAF0]">
        <div
          className="w-16 h-16 rounded-full text-white font-bold flex items-center justify-center"
          style={{ background: user.avatar }}
        >
          {initials}
        </div>
        <p className="text-lg font-semibold text-[#102537] mt-3">{user.name}</p>
        <p className="text-sm text-[#6A7A8A]">{user.email}</p>
      </div>

      <button
        onClick={onLogout}
        className="w-full mt-4 rounded-2xl py-3.5 bg-white border border-[#E5EAF0] text-[#C53939] font-semibold"
      >
        Sair da conta
      </button>
    </div>
  );
}

export default function HomeScreen({ user, onLogout, onOpenGoal, onCreateGoal }: Props) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [tab, setTab] = useState<"metas" | "progresso" | "perfil">("metas");

  useEffect(() => {
    setGoals(getGoals(user.id));
  }, [user.id]);

  const sorted = [...goals].sort((a, b) => {
    const aT = a.records.at(-1)?.createdAt ?? a.createdAt;
    const bT = b.records.at(-1)?.createdAt ?? b.createdAt;
    return new Date(bT).getTime() - new Date(aT).getTime();
  });

  const filtered = sorted.filter((g) => g.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-dvh bg-[#F4F7F9]">
      <div className="bg-[#138F83] flex-shrink-0 pt-11 pb-3 px-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-[30px] font-bold tracking-tight">MetaChat</h1>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-full text-white/90 flex items-center justify-center hover:bg-white/15 transition-colors">
              <IconSearch />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowMenu((v) => !v)}
                className="w-8 h-8 rounded-full text-white/90 flex items-center justify-center hover:bg-white/15 transition-colors"
              >
                <IconDots />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-10 w-44 bg-white rounded-xl border border-[#E5EAF0] shadow-xl py-1 z-50">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onCreateGoal();
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#102537] hover:bg-[#F4F7F9]"
                  >
                    Nova meta
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setTab("perfil");
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#102537] hover:bg-[#F4F7F9]"
                  >
                    Perfil
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {tab === "metas" && (
          <div className="mt-3 bg-white/90 rounded-full px-3 py-2 flex items-center gap-2">
            <span className="text-[#90A0B4]"><IconSearch /></span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar meta..."
              className="bg-transparent text-sm text-[#102537] placeholder-[#90A0B4] w-full focus:outline-none"
            />
          </div>
        )}
      </div>

      {tab === "metas" && (
        <div className="flex-1 overflow-y-auto bg-[#F4F7F9] pb-28">
          <div className="px-4 pt-3 pb-2 flex items-center justify-between">
            <p className="text-[#138F83] text-sm font-bold uppercase tracking-wide">Suas metas</p>
            <button onClick={onCreateGoal} className="text-[#138F83] text-xs font-semibold">
              Criar nova
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="px-4">
              <div className="bg-white rounded-2xl border border-[#E5EAF0] p-6 text-center">
                <p className="text-[#102537] font-semibold">{search ? "Nenhuma meta encontrada" : "Nenhuma meta criada"}</p>
                <p className="text-[#6A7A8A] text-sm mt-1">Use o botão Nova meta para começar.</p>
              </div>
            </div>
          ) : (
            <div className="px-2">
              {filtered.map((goal) => {
                const lastRecord = goal.records.at(-1);
                const preview = lastRecord
                  ? lastRecord.imageUrl
                    ? "Mídia anexada"
                    : lastRecord.text
                  : goal.description || "Sem registros ainda";

                return (
                  <button
                    key={goal.id}
                    onClick={() => onOpenGoal(goal)}
                    className="w-full px-2 py-1.5"
                  >
                    <div className="bg-white rounded-2xl border border-[#E5EAF0] px-3 py-3 flex items-center gap-3 text-left">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{ background: goalColor(goal) }}
                      >
                        {goalInitials(goal.title)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-[18px] leading-5 font-semibold text-[#102537] truncate">{goal.title}</p>
                          <span className="text-xs text-[#6A7A8A] shrink-0">{formatTime(lastRecord?.createdAt ?? goal.createdAt)}</span>
                        </div>
                        <p className="text-sm text-[#6A7A8A] truncate mt-1">{preview}</p>
                      </div>

                      {goal.records.length > 0 && !goal.completed && (
                        <span className="min-w-5 h-5 px-1 rounded-full bg-[#24C269] text-white text-[11px] font-bold flex items-center justify-center">
                          {goal.records.length}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === "progresso" && <ProgressTab user={user} />}
      {tab === "perfil" && <ProfileTab user={user} onLogout={onLogout} />}

      {tab === "metas" && (
        <button
          onClick={onCreateGoal}
          className="fixed right-5 bottom-[84px] h-14 px-5 rounded-full bg-[#24C269] shadow-lg flex items-center gap-2 text-white font-semibold"
        >
          <IconPlus />
          Nova meta
        </button>
      )}

      <div className="bg-white border-t border-[#E5EAF0] flex-shrink-0" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="grid grid-cols-3">
          <button onClick={() => setTab("metas")} className="py-2.5 flex flex-col items-center gap-1">
            <IconTabGoals active={tab === "metas"} />
            <span className="text-[11px] font-medium" style={{ color: tab === "metas" ? "#138F83" : "#90A0B4" }}>Metas</span>
          </button>
          <button onClick={() => setTab("progresso")} className="py-2.5 flex flex-col items-center gap-1">
            <IconTabProgress active={tab === "progresso"} />
            <span className="text-[11px] font-medium" style={{ color: tab === "progresso" ? "#138F83" : "#90A0B4" }}>Progresso</span>
          </button>
          <button onClick={() => setTab("perfil")} className="py-2.5 flex flex-col items-center gap-1">
            <IconTabProfile active={tab === "perfil"} />
            <span className="text-[11px] font-medium" style={{ color: tab === "perfil" ? "#138F83" : "#90A0B4" }}>Perfil</span>
          </button>
        </div>
      </div>

      {showMenu && <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />}
    </div>
  );
}
