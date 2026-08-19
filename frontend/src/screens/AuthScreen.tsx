import { useState } from "react";
import type { User } from "../types";
import { registerUser, findUser } from "../store";

interface Props {
  onLogin: (user: User) => void;
  onAdmin: () => void;
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ) : (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function AuthScreen({ onLogin, onAdmin }: Props) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function switchTab(t: "login" | "register") {
    setTab(t);
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (email.trim() === "admin@metachat.com" && password === "admin123") {
      onAdmin();
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (tab === "register") {
        if (!name.trim()) { setError("Digite seu nome."); setLoading(false); return; }
        const user = registerUser(name.trim(), email.trim(), password);
        if (!user) { setError("Este e-mail já está cadastrado."); setLoading(false); return; }
        onLogin(user);
      } else {
        const user = findUser(email.trim(), password);
        if (!user) { setError("E-mail ou senha incorretos."); setLoading(false); return; }
        onLogin(user);
      }
      setLoading(false);
    }, 450);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-white px-6">
      {/* Logo mark */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 shadow-sm" style={{ background: "#25D36620" }}>
          <svg width="46" height="46" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="15" r="8" fill="#25D366" />
            <path d="M7 37c0-8.284 6.716-15 15-15s15 6.716 15 15" stroke="#25D366" strokeWidth="3" strokeLinecap="round" />
            <circle cx="33" cy="29" r="8" fill="#075E54" />
            <path d="M30 29l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-[#111B21] text-2xl font-bold tracking-tight">MetaChat</h1>
        <p className="text-[#8696A0] text-sm mt-1">Suas metas em formato de conversa</p>
      </div>

      {/* Tab switcher */}
      <div className="flex w-full max-w-xs bg-[#F0F2F5] rounded-2xl p-1 mb-7">
        {(["login", "register"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => switchTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === t ? "bg-white text-[#075E54] shadow-sm" : "text-[#8696A0]"
            }`}
          >
            {t === "login" ? "Entrar" : "Cadastrar"}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-4">
        {tab === "register" && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#8696A0] uppercase tracking-wider">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
              className="w-full bg-[#F0F2F5] rounded-2xl px-4 py-3.5 text-sm text-[#111B21] placeholder-[#C4CDD5] focus:outline-none focus:ring-2 focus:ring-[#25D366]/40 transition-all"
            />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#8696A0] uppercase tracking-wider">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            className="w-full bg-[#F0F2F5] rounded-2xl px-4 py-3.5 text-sm text-[#111B21] placeholder-[#C4CDD5] focus:outline-none focus:ring-2 focus:ring-[#25D366]/40 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#8696A0] uppercase tracking-wider">Senha</label>
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              className="w-full bg-[#F0F2F5] rounded-2xl px-4 py-3.5 pr-11 text-sm text-[#111B21] placeholder-[#C4CDD5] focus:outline-none focus:ring-2 focus:ring-[#25D366]/40 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C4CDD5] hover:text-[#8696A0] transition-colors"
            >
              <EyeIcon open={showPwd} />
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" className="text-red-400 flex-shrink-0">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-sm text-red-500">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl text-sm font-bold text-white transition-all shadow-md active:scale-[0.98] disabled:opacity-60 mt-1"
          style={{ background: "linear-gradient(135deg,#25D366,#075E54)" }}
        >
          {loading
            ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />Aguarde...</span>
            : tab === "login" ? "Entrar" : "Criar conta"}
        </button>
      </form>

      <p className="text-sm text-[#8696A0] mt-6">
        {tab === "login" ? "Sem conta? " : "Já tem conta? "}
        <button
          type="button"
          onClick={() => switchTab(tab === "login" ? "register" : "login")}
          className="text-[#128C7E] font-semibold hover:underline"
        >
          {tab === "login" ? "Cadastre-se" : "Entrar"}
        </button>
      </p>

      <p className="text-xs text-[#C4CDD5] mt-8">Acesso admin disponível</p>
    </div>
  );
}
