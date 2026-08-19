import { useEffect, useState } from "react";
import type { Goal, User } from "../types";
import { deleteGoal, getGoals, saveGoal } from "../store";

interface Props {
  user: User;
  onBack: () => void;
  onCreated: (goal: Goal) => void;
}

const CATEGORIES = [
  { id: "saude", label: "Saúde", color: "#1C9C8F" },
  { id: "estudos", label: "Aprendizado", color: "#5E71D8" },
  { id: "financas", label: "Finanças", color: "#D4891E" },
  { id: "pessoal", label: "Pessoal", color: "#CA4D8A" },
  { id: "viagem", label: "Viagem", color: "#2F9AA7" },
  { id: "carreira", label: "Carreira", color: "#2F8DE4" },
  { id: "hobby", label: "Hobby", color: "#D36F2B" },
  { id: "outro", label: "Outro", color: "#758196" },
];

function IconClose() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function CreateGoalScreen({ user, onBack, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"criar" | "gerenciar">("criar");
  const [goals, setGoals] = useState<Goal[]>([]);

  const today = new Date().toISOString().split("T")[0];

  function refreshGoals() {
    setGoals(getGoals(user.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }

  useEffect(() => {
    refreshGoals();
  }, [user.id]);

  function handleCreate() {
    if (!title.trim()) {
      setError("Digite o nome da meta.");
      return;
    }

    setError("");

    const goal: Goal = {
      id: crypto.randomUUID(),
      userId: user.id,
      title: title.trim(),
      description: description.trim(),
      category: category.id,
      deadline,
      emoji: "",
      color: category.color,
      records: [],
      createdAt: new Date().toISOString(),
      completed: false,
    };

    saveGoal(goal);
    onCreated(goal);
  }

  function toggleCompleted(goal: Goal) {
    const updated = { ...goal, completed: !goal.completed };
    saveGoal(updated);
    refreshGoals();
  }

  function removeGoal(goalId: string) {
    deleteGoal(goalId);
    refreshGoals();
  }

  return (
    <div className="flex flex-col h-dvh bg-[#F4F7F9]">
      <div className="bg-[#138F83] px-4 pt-11 pb-4 flex items-center justify-between">
        <button onClick={onBack} className="w-9 h-9 rounded-full text-white flex items-center justify-center hover:bg-white/15">
          <IconClose />
        </button>
        <h2 className="text-white text-[30px] font-bold tracking-tight">Nova meta</h2>
        <div className="w-9" />
      </div>

      <div className="px-4 pt-3 pb-2">
        <div className="bg-white rounded-full p-1 border border-[#E5EAF0] grid grid-cols-2 gap-1">
          <button
            onClick={() => setTab("criar")}
            className="h-9 rounded-full text-sm font-semibold"
            style={{ background: tab === "criar" ? "#138F83" : "transparent", color: tab === "criar" ? "white" : "#6A7A8A" }}
          >
            Criar
          </button>
          <button
            onClick={() => {
              setTab("gerenciar");
              refreshGoals();
            }}
            className="h-9 rounded-full text-sm font-semibold"
            style={{ background: tab === "gerenciar" ? "#138F83" : "transparent", color: tab === "gerenciar" ? "white" : "#6A7A8A" }}
          >
            Gerenciar
          </button>
        </div>
      </div>

      {tab === "criar" && (
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          <div className="bg-white rounded-3xl border border-[#E5EAF0] p-4 space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#138F83] uppercase tracking-wider mb-2">Nome da meta</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Correr 5km sem parar"
                className="w-full rounded-xl bg-[#1F1F1F] px-3.5 py-3 text-[#F5F8FA] text-sm placeholder-[#7C8794] focus:outline-none"
                style={{ border: error && !title.trim() ? "1px solid #C53939" : "1px solid transparent" }}
                maxLength={80}
              />
              {error && <p className="text-[#C53939] text-xs mt-1.5">{error}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#138F83] uppercase tracking-wider mb-2">Categoria</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const active = category.id === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat)}
                      className="h-8 px-3 rounded-full text-sm font-medium border transition-colors"
                      style={{
                        background: active ? cat.color : "white",
                        borderColor: active ? cat.color : "#CCD6E0",
                        color: active ? "white" : "#4A5B6D",
                      }}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#138F83] uppercase tracking-wider mb-2">Prazo (opcional)</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={today}
                className="w-full rounded-xl bg-[#1F1F1F] px-3.5 py-3 text-sm focus:outline-none"
                style={{ color: deadline ? "#F5F8FA" : "#7C8794" }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#138F83] uppercase tracking-wider mb-2">Descrição (opcional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Descreva como quer evoluir nessa meta"
                className="w-full rounded-xl bg-[#1F1F1F] px-3.5 py-3 text-[#F5F8FA] text-sm placeholder-[#7C8794] resize-none focus:outline-none"
                maxLength={280}
              />
            </div>

            <div className="rounded-xl bg-[#E7F5F2] border border-[#C8E7E1] p-3">
              <p className="text-[#138F83] text-xs font-bold uppercase">Dica do MetaChat</p>
              <p className="text-sm text-[#4A5B6D] mt-1">Quebre o objetivo em registros curtos e frequentes para acompanhar evolução real.</p>
            </div>
          </div>

          <button
            onClick={handleCreate}
            className="w-full mt-4 h-12 rounded-2xl text-white font-semibold"
            style={{ background: title.trim() ? "#24C269" : "#9BB5AF" }}
          >
            Criar meta
          </button>
        </div>
      )}

      {tab === "gerenciar" && (
        <div className="flex-1 overflow-y-auto px-3 pb-5">
          {goals.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E5EAF0] p-6 text-center mt-2">
              <p className="text-[#102537] font-semibold">Nenhuma meta cadastrada</p>
              <p className="text-[#6A7A8A] text-sm mt-1">Crie sua primeira meta na aba Criar.</p>
            </div>
          ) : (
            goals.map((goal) => (
              <div key={goal.id} className="bg-white rounded-2xl border border-[#E5EAF0] p-3.5 mb-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[#102537] font-semibold truncate">{goal.title}</p>
                    <p className="text-xs text-[#6A7A8A] mt-1">{goal.records.length} registros</p>
                  </div>
                  <span
                    className="text-[11px] font-semibold px-2 py-1 rounded-full"
                    style={{
                      background: goal.completed ? "#E7F5F2" : "#EEF3FA",
                      color: goal.completed ? "#138F83" : "#5F7388",
                    }}
                  >
                    {goal.completed ? "Concluída" : "Ativa"}
                  </span>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => toggleCompleted(goal)}
                    className="flex-1 h-9 rounded-xl bg-[#F4F7F9] text-[#2F526D] text-sm font-semibold"
                  >
                    {goal.completed ? "Reativar" : "Concluir"}
                  </button>
                  <button
                    onClick={() => removeGoal(goal.id)}
                    className="h-9 px-3.5 rounded-xl bg-[#FDEBEC] text-[#C53939] text-sm font-semibold"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
