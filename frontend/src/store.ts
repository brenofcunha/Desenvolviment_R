import type { User, Goal } from "./types";

const USERS_KEY = "wa_goals_users";
const GOALS_KEY = "wa_goals_goals";
const SESSION_KEY = "wa_goals_session";

export function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveUser(user: User) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUser(email: string, password: string): User | null {
  const users = getUsers();
  const key = `wa_goals_pwd_${email}`;
  const storedPwd = localStorage.getItem(key);
  if (storedPwd !== password) return null;
  return users.find((u) => u.email === email) || null;
}

export function registerUser(name: string, email: string, password: string): User | null {
  const users = getUsers();
  if (users.find((u) => u.email === email)) return null;
  const avatarColors = ["#25D366", "#128C7E", "#00BCD4", "#FF5722", "#9C27B0"];
  const user: User = {
    id: crypto.randomUUID(),
    name,
    email,
    avatar: avatarColors[Math.floor(Math.random() * avatarColors.length)],
  };
  saveUser(user);
  localStorage.setItem(`wa_goals_pwd_${email}`, password);
  return user;
}

export function getSession(): User | null {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

export function setSession(user: User | null) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
}

export function getGoals(userId: string): Goal[] {
  try {
    const all = JSON.parse(localStorage.getItem(GOALS_KEY) || "[]") as Goal[];
    return all.filter((g) => g.userId === userId);
  } catch {
    return [];
  }
}

export function saveGoal(goal: Goal) {
  const all: Goal[] = JSON.parse(localStorage.getItem(GOALS_KEY) || "[]");
  const idx = all.findIndex((g) => g.id === goal.id);
  if (idx >= 0) all[idx] = goal;
  else all.push(goal);
  localStorage.setItem(GOALS_KEY, JSON.stringify(all));
}

export function deleteGoal(goalId: string) {
  const all: Goal[] = JSON.parse(localStorage.getItem(GOALS_KEY) || "[]");
  localStorage.setItem(GOALS_KEY, JSON.stringify(all.filter((g) => g.id !== goalId)));
}

export function getAllGoals(): Goal[] {
  try {
    return JSON.parse(localStorage.getItem(GOALS_KEY) || "[]") as Goal[];
  } catch {
    return [];
  }
}
