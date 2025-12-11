import React, { useState } from "react";
import { api } from "../utils/api";

export const Signup = ({ onBackToLogin }) => {
  const [form, setForm] = useState({
    cnic: "",
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateInputs = () => {
    if (!form.cnic.trim()) return "CNIC is required";
    if (!form.name.trim()) return "Name is required";
    if (!form.email.trim()) return "Email is required";
    if (!form.password.trim()) return "Password is required";
    return null;
  };

  const handleSignup = async () => {
    const v = validateInputs();
    if (v) {
      setError(v);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await api.post("/users/register", form);
      setSuccess("Account created successfully!");
      setTimeout(() => onBackToLogin(), 1500);
    } catch (err) {
      setError(err?.error || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-gray-100 p-4">

      {/* Glass Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8">

        <h1 className="text-3xl font-bold text-center mb-8 tracking-wide">
          Create Account
        </h1>

        <div className="space-y-4">

          <InputField label="CNIC" value={form.cnic} onChange={(e) => updateField("cnic", e.target.value)} />

          <InputField label="Name" value={form.name} onChange={(e) => updateField("name", e.target.value)} />

          <InputField label="Email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} />

          <InputField label="Password" type="password" value={form.password} onChange={(e) => updateField("password", e.target.value)} />

          <InputField label="Phone (optional)" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}

          <button
            onClick={handleSignup}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition bg-blue-600 hover:bg-blue-700 shadow-md 
              ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <button
            onClick={onBackToLogin}
            className="w-full py-2 text-gray-300 hover:text-white text-sm mt-2"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------- Reusable Input Component -------- */

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
