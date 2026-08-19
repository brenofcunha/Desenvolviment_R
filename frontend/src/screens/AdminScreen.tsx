import { useState, useEffect } from "react";
import { getUsers, getAllGoals } from "../store";
import type { User, Goal } from "../types";

interface Props {
  onBack: () => void;
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: color + "18" }}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-[#111B21]">{value}</p>
        <p className="text-xs text-[#667781] font-medium">{label}</p>
      </div>
    </div>
  );
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

type LogEntry = {
  time: string;
  type: "user_created" | "goal_created" | "record_added";
  userName: string;
  detail: string;
};

export default function AdminScreen({ onBack }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tab, setTab] = useState<"overview" | "users" | "goals" | "log">("overview");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setUsers(getUsers());
    setGoals(getAllGoals());
  }, []);

  const totalRecords = goals.reduce((s, g) => s + g.records.length, 0);
  const completedGoals = goals.filter((g) => g.completed).length;
  const activeGoals = goals.filter((g) => !g.completed).length;

  // Build activity log
  const logEntries: LogEntry[] = [];
  users.forEach((u) => {
    logEntries.push({
      time: "—",
      type: "user_created",
      userName: u.name,
      detail: u.email,
    });
  });
  goals.forEach((g) => {
    const user = users.find((u) => u.id === g.userId);
    logEntries.push({
      time: g.createdAt,
      type: "goal_created",
      userName: user?.name || "Desconhecido",
      detail: g.title,
    });
    g.records.forEach((r) => {
      logEntries.push({
        time: r.createdAt,
        type: "record_added",
        userName: user?.name || "Desconhecido",
        detail: r.text.slice(0, 60) + (r.text.length > 60 ? "…" : ""),
      });
    });
  });
  logEntries.sort((a, b) => {
    if (a.time === "—") return 1;
    if (b.time === "—") return 1;
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });

  const TYPE_CONFIG: Record<LogEntry["type"], { label: string; color: string; icon: string }> = {
    user_created: { label: "Novo usuário", color: "#9C27B0", icon: "👤" },
    goal_created: { label: "Meta criada", color: "#2196F3", icon: "🎯" },
    record_added: { label: "Registro", color: "#25D366", icon: "📝" },
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredGoals = goals.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-dvh bg-[#F0F2F5] screen-enter" style={{ maxWidth: "100vw", width: "100%" }}>
      {/* Header */}
      <div
        className="px-4 pt-12 pb-4 flex-shrink-0"
        style={{ background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="text-white/70 hover:text-white p-1 -ml-1 transition-colors">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-lg bg-[#25D366] flex items-center justify-center text-sm font-bold text-white">A</div>
            <div>
              <h1 className="text-white font-bold text-base leading-none">Painel Admin</h1>
              <p className="text-white/50 text-xs mt-0.5">MetaChat — Visão geral do sistema</p>
            </div>
          </div>
          <div className="bg-green-500/20 border border-green-500/40 rounded-full px-2.5 py-1">
            <span className="text-green-400 text-xs font-semibold">● ONLINE</span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-white/10 rounded-xl p-1">
          {(["overview", "users", "goals", "log"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                tab === t ? "bg-white text-[#1A1A2E]" : "text-white/60 hover:text-white"
              }`}
            >
              {{ overview: "Geral", users: "Usuários", goals: "Metas", log: "Log" }[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Search (users/goals tabs) */}
      {(tab === "users" || tab === "goals") && (
        <div className="px-4 py-3 bg-white border-b border-[#E8ECEF] flex-shrink-0">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0BEC5]" width="16" height="16" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tab === "users" ? "Buscar usuários..." : "Buscar metas..."}
              className="w-full bg-[#F5F7F9] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#111B21] placeholder-[#B0BEC5] focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="p-4 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Usuários" value={users.length} icon="👥" color="#9C27B0" />
              <StatCard label="Metas totais" value={goals.length} icon="🎯" color="#2196F3" />
              <StatCard label="Registros" value={totalRecords} icon="📝" color="#25D366" />
              <StatCard label="Concluídas" value={completedGoals} icon="🏆" color="#FF9800" />
            </div>

            {/* Active vs Completed */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-sm font-semibold text-[#111B21] mb-3">Status das metas</p>
              <div className="flex gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-[#667781] mb-1">
                    <span>Ativas</span>
                    <span>{activeGoals}</span>
                  </div>
                  <div className="h-2 bg-[#F0F2F5] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#2196F3] transition-all"
                      style={{ width: goals.length ? `${(activeGoals / goals.length) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-[#667781] mb-1">
                    <span>Concluídas</span>
                    <span>{completedGoals}</span>
                  </div>
                  <div className="h-2 bg-[#F0F2F5] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#25D366] transition-all"
                      style={{ width: goals.length ? `${(completedGoals / goals.length) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Category distribution */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-sm font-semibold text-[#111B21] mb-3">Distribuição por categoria</p>
              {["saude", "carreira", "financas", "estudos", "pessoal", "viagem", "hobby", "outro"].map((cat) => {
                const count = goals.filter((g) => g.category === cat).length;
                if (!count) return null;
                const emojis: Record<string, string> = {
                  saude: "💪", carreira: "💼", financas: "💰", estudos: "📚",
                  pessoal: "🌟", viagem: "✈️", hobby: "🎨", outro: "🎯",
                };
                return (
                  <div key={cat} className="flex items-center gap-3 mb-2">
                    <span className="text-base w-6">{emojis[cat]}</span>
                    <div className="flex-1 h-2 bg-[#F0F2F5] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#128C7E]"
                        style={{ width: `${(count / goals.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#667781] w-4 text-right">{count}</span>
                  </div>
                );
              })}
              {goals.length === 0 && <p className="text-sm text-[#667781]">Sem dados ainda</p>}
            </div>

            {/* Recent activity */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-sm font-semibold text-[#111B21] mb-3">Atividade recente</p>
              {logEntries.slice(0, 5).map((entry, i) => (
                <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background: TYPE_CONFIG[entry.type].color + "18" }}
                  >
                    {TYPE_CONFIG[entry.type].icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-[#111B21] truncate">{entry.userName}</p>
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: TYPE_CONFIG[entry.type].color + "18", color: TYPE_CONFIG[entry.type].color }}
                      >
                        {TYPE_CONFIG[entry.type].label}
                      </span>
                    </div>
                    <p className="text-xs text-[#667781] truncate">{entry.detail}</p>
                    {entry.time !== "—" && <p className="text-[10px] text-[#B0BEC5] mt-0.5">{fmt(entry.time)}</p>}
                  </div>
                </div>
              ))}
              {logEntries.length === 0 && <p className="text-sm text-[#667781]">Nenhuma atividade registrada</p>}
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === "users" && (
          <div className="p-4 flex flex-col gap-3">
            {filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-4xl mb-3">👥</span>
                <p className="text-[#667781] font-medium">Nenhum usuário encontrado</p>
              </div>
            ) : (
              filteredUsers.map((u) => {
                const userGoals = goals.filter((g) => g.userId === u.id);
                const userRecords = userGoals.reduce((s, g) => s + g.records.length, 0);
                const isExpanded = expandedUser === u.id;
                const initials = u.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
                return (
                  <div key={u.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <button
                      onClick={() => setExpandedUser(isExpanded ? null : u.id)}
                      className="w-full flex items-center gap-3 p-4 text-left"
                    >
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{ background: u.avatar }}
                      >
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#111B21] text-sm">{u.name}</p>
                        <p className="text-xs text-[#667781] truncate">{u.email}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <div className="flex gap-2">
                          <span className="text-xs bg-[#E3F2FD] text-[#1565C0] rounded-full px-2 py-0.5 font-medium">{userGoals.length} metas</span>
                          <span className="text-xs bg-[#E8F5E9] text-[#2E7D32] rounded-full px-2 py-0.5 font-medium">{userRecords} reg.</span>
                        </div>
                        <svg
                          width="14" height="14" fill="none" viewBox="0 0 24 24"
                          className={`text-[#B0BEC5] transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        >
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-[#F0F2F5] px-4 py-3 bg-[#FAFBFC] fade-in">
                        <p className="text-xs font-semibold text-[#667781] uppercase tracking-wider mb-2">Metas</p>
                        {userGoals.length === 0 ? (
                          <p className="text-xs text-[#B0BEC5]">Nenhuma meta criada</p>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {userGoals.map((g) => (
                              <div key={g.id} className="flex items-center gap-2.5 bg-white rounded-xl p-2.5 border border-[#F0F2F5]">
                                <span className="text-lg">{g.emoji}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-[#111B21] truncate">{g.title}</p>
                                  <p className="text-[10px] text-[#667781]">{g.records.length} registro{g.records.length !== 1 ? "s" : ""}</p>
                                </div>
                                <span
                                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                  style={g.completed
                                    ? { background: "#E8F5E9", color: "#2E7D32" }
                                    : { background: "#E3F2FD", color: "#1565C0" }}
                                >
                                  {g.completed ? "Concluída" : "Ativa"}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* GOALS */}
        {tab === "goals" && (
          <div className="p-4 flex flex-col gap-3">
            {filteredGoals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-4xl mb-3">🎯</span>
                <p className="text-[#667781] font-medium">Nenhuma meta encontrada</p>
              </div>
            ) : (
              filteredGoals.map((g) => {
                const user = users.find((u) => u.id === g.userId);
                const initials = user ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";
                return (
                  <div key={g.id} className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: g.color + "18", border: `2px solid ${g.color}30` }}
                      >
                        {g.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className="font-semibold text-[#111B21] text-sm truncate">{g.title}</p>
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                            style={g.completed
                              ? { background: "#E8F5E9", color: "#2E7D32" }
                              : { background: "#E3F2FD", color: "#1565C0" }}
                          >
                            {g.completed ? "✅ Concluída" : "🔵 Ativa"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                            style={{ background: user?.avatar || "#B0BEC5" }}
                          >
                            {initials}
                          </div>
                          <p className="text-xs text-[#667781] truncate">{user?.name || "Usuário removido"}</p>
                        </div>
                        <div className="h-1.5 bg-[#F0F2F5] rounded-full overflow-hidden mb-2">
                          <div
                            className="h-full rounded-full"
                            style={{ width: g.completed ? "100%" : "40%", background: g.color }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-[#B0BEC5]">Criada em {fmt(g.createdAt)}</p>
                          <p className="text-xs text-[#667781] font-medium">{g.records.length} registros</p>
                        </div>
                        {g.deadline && (
                          <p className="text-[10px] text-[#B0BEC5] mt-0.5">
                            Prazo: {new Date(g.deadline + "T00:00:00").toLocaleDateString("pt-BR")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* LOG */}
        {tab === "log" && (
          <div className="p-4">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-[#F0F2F5] flex items-center justify-between">
                <p className="text-sm font-semibold text-[#111B21]">Log de atividades</p>
                <span className="text-xs bg-[#F0F2F5] text-[#667781] rounded-full px-2.5 py-1 font-medium">
                  {logEntries.length} entradas
                </span>
              </div>
              {logEntries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="text-3xl mb-3">📋</span>
                  <p className="text-[#667781] text-sm">Nenhuma atividade registrada</p>
                </div>
              ) : (
                <div className="divide-y divide-[#F0F2F5]">
                  {logEntries.map((entry, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                        style={{ background: TYPE_CONFIG[entry.type].color + "15" }}
                      >
                        {TYPE_CONFIG[entry.type].icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                            style={{ background: TYPE_CONFIG[entry.type].color + "15", color: TYPE_CONFIG[entry.type].color }}
                          >
                            {TYPE_CONFIG[entry.type].label}
                          </span>
                          <span className="text-xs font-semibold text-[#111B21]">{entry.userName}</span>
                        </div>
                        <p className="text-xs text-[#667781] mt-0.5 truncate">{entry.detail}</p>
                        {entry.time !== "—" && (
                          <p className="text-[10px] text-[#B0BEC5] mt-0.5">{fmt(entry.time)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
