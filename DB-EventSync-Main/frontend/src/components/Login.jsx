import React, { useState } from "react";

export const Login = ({ onLogin }) => {
  const [isOrganiser, setIsOrganiser] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateInputs = () => {
    if (!form.email.trim()) return "Email is required";
    if (!isOrganiser && !form.password.trim()) return "Password is required";
    return null;
  };

const handleSubmit = async () => {
    const validationError = validateInputs();
    if (validationError) {
        setError(validationError);
        return;
    }

    setError("");
    setLoading(true);

    try {
        if (isOrganiser) {
            const response = await fetch("http://localhost:3001/api/organisers/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: form.email.trim().toLowerCase(),
                    password: form.password.trim(),
                }),
            });

            const data = await response.json();
            console.log("🔵 Organiser login response:", data);

            if (response.ok && data.success && data.organiser) {
                // Pass organiser data to parent
                onLogin({ type: "organiser", data: data.organiser });
            } else {
                setError(data.error || "Invalid organiser credentials");
            }

        } else {
            // USER login stays the same
            const response = await fetch("http://localhost:3001/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: form.email.trim().toLowerCase(),
                    password: form.password.trim(),
                }),
            });

            const data = await response.json();
            if (response.ok && data && data.cnic) {
                const userObj = {
                    CNIC: data.cnic,
                    NAME: data.name,
                    EMAIL: data.email,
                    PHONE: data.phone,
                };
                onLogin({ type: "user", data: userObj });
            } else {
                setError(data.error || "Invalid credentials");
            }
        }
    } catch (err) {
        console.error("💥 LOGIN ERROR:", err);
        setError("Login failed. Please try again.");
    } finally {
        setLoading(false);
    }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-gray-100 p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 tracking-wide">
          EventSync
        </h1>

        <div className="flex gap-2 mb-6">
          <TabButton active={!isOrganiser} label="User" onClick={() => setIsOrganiser(false)} />
          <TabButton active={isOrganiser} label="Organiser" onClick={() => setIsOrganiser(true)} />
        </div>

        <div className="space-y-4">
          <InputField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
          />

          { (
            <InputField
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
            />
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition bg-blue-600 hover:bg-blue-700 shadow-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            onClick={() => onLogin({ type: "signup" })}
            className="w-full text-gray-300 hover:text-white text-sm mt-4"
          >
            Signup
          </button>
        </div>

       
      </div>
    </div>
  );
};

const TabButton = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-2 rounded-lg font-medium transition ${
      active ? "bg-blue-600 text-white shadow-md" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
    }`}
  >
    {label}
  </button>
);

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm mb-1 text-gray-300">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
    />
  </div>
);