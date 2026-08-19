import { useState, useEffect } from "react";
import type { User, Goal, Screen } from "./types";
import { getSession, setSession } from "./store";
import AuthScreen from "./screens/AuthScreen";
import HomeScreen from "./screens/HomeScreen";
import CreateGoalScreen from "./screens/CreateGoalScreen";
import GoalDetailScreen from "./screens/GoalDetailScreen";
import AddRecordScreen from "./screens/AddRecordScreen";
import AdminScreen from "./screens/AdminScreen";

type AppScreen = Screen | "admin";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [screen, setScreen] = useState<AppScreen>("auth");
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session);
      setScreen("home");
    }
  }, []);

  function handleLogin(u: User) {
    setSession(u);
    setUser(u);
    setScreen("home");
    setRefreshKey((k) => k + 1);
  }

  function handleLogout() {
    setSession(null);
    setUser(null);
    setScreen("auth");
    setSelectedGoal(null);
  }

  function openGoal(goal: Goal) {
    setSelectedGoal(goal);
    setScreen("goal-detail");
  }

  function goBack() {
    if (screen === "goal-detail" || screen === "create-goal") setScreen("home");
    else if (screen === "add-record") setScreen("goal-detail");
    else if (screen === "admin") setScreen("auth");
  }

  function onGoalCreated(goal: Goal) {
    setScreen("home");
    setRefreshKey((k) => k + 1);
  }

  function onRecordAdded(updatedGoal: Goal) {
    setSelectedGoal(updatedGoal);
    setScreen("goal-detail");
    setRefreshKey((k) => k + 1);
  }

  function onGoalUpdated(updatedGoal: Goal) {
    setSelectedGoal(updatedGoal);
    setRefreshKey((k) => k + 1);
  }

  return (
    <>
      {screen === "auth" && (
        <AuthScreen onLogin={handleLogin} onAdmin={() => setScreen("admin")} />
      )}
      {screen === "admin" && <AdminScreen onBack={() => setScreen("auth")} />}
      {screen === "home" && user && (
        <HomeScreen
          key={refreshKey}
          user={user}
          onLogout={handleLogout}
          onOpenGoal={openGoal}
          onCreateGoal={() => setScreen("create-goal")}
        />
      )}
      {screen === "create-goal" && user && (
        <CreateGoalScreen user={user} onBack={goBack} onCreated={onGoalCreated} />
      )}
      {screen === "goal-detail" && selectedGoal && user && (
        <GoalDetailScreen
          key={`${selectedGoal.id}-${refreshKey}`}
          goal={selectedGoal}
          user={user}
          onBack={goBack}
          onAddRecord={() => setScreen("add-record")}
          onGoalUpdated={onGoalUpdated}
          onDelete={() => { setScreen("home"); setRefreshKey((k) => k + 1); }}
        />
      )}
      {screen === "add-record" && selectedGoal && user && (
        <AddRecordScreen
          goal={selectedGoal}
          onBack={goBack}
          onRecordAdded={onRecordAdded}
        />
      )}
    </>
  );
}
