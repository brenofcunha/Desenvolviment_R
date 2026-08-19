export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Record {
  id: string;
  goalId: string;
  text: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  deadline: string;
  emoji: string;
  color: string;
  records: Record[];
  createdAt: string;
  completed: boolean;
}

export type Screen =
  | "auth"
  | "home"
  | "create-goal"
  | "goal-detail"
  | "add-record";
