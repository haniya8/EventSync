import React, { useState } from "react";
import { LogOut } from "lucide-react";

import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { UserDashboard } from "./components/UserDashboard";
import { OrganiserDashboard } from "./components/OrganiserDashboard";

const AuthContext = React.createContext(null);
export const useAuth = () => React.useContext(AuthContext);

export default function App() {
  const [auth, setAuth] = useState(null);     // Logged-in user/organiser
  const [screen, setScreen] = useState("login"); // login | signup

  /* -------------------- HANDLE LOGIN FLOW -------------------- */
  const handleLogin = (info) => {
    // Signup request from the Login screen
    if (info?.type === "signup") {
      setScreen("signup");
      return;
    }

    // Normal login (user or organiser)
    setAuth(info);
  };

  /* -------------------- LOGOUT -------------------- */
  const handleLogout = () => {
    setAuth(null);
    setScreen("login");
  };

  /* -------------------- UNAUTHENTICATED SCREENS -------------------- */
  if (!auth) {
    if (screen === "login") {
      return <Login onLogin={handleLogin} />;
    }

    if (screen === "signup") {
      return <Signup onBackToLogin={() => setScreen("login")} />;
    }
  }

  /* -------------------- AUTHENTICATED DASHBOARD -------------------- */
  return (
    <AuthContext.Provider value={auth}>
      <div className="min-h-screen bg-gray-50">
        
        {/* HEADER */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            
            <h1 className="text-2xl font-bold text-gray-800">
              {auth.type === "organiser" ? "Organiser Portal" : "Event Booking"}
            </h1>

            <div className="flex items-center gap-4">
              <span className="text-gray-600">{auth.data.NAME}</span>

              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </header>

        {/* MAIN DASHBOARD */}
        {auth.type === "user" ? (
          <UserDashboard user={auth.data} />
        ) : (
          <OrganiserDashboard organiser={auth.data} />
        )}
      </div>
    </AuthContext.Provider>
  );
}
