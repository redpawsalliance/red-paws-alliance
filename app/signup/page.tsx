"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [message, setMessage] =
    useState("");

  async function signup(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const { error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (error) {
      setMessage(`❌ ${error.message}`);
      return;
    }

    setMessage(
      "✅ Account created. Check your email."
    );
  }

  return (
    <main className="min-h-screen bg-red-50 p-8">

      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-8">

        <h1 className="text-4xl font-bold text-red-700 mb-6">
          Create Account
        </h1>

        <form
          onSubmit={signup}
          className="space-y-4"
        >

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border p-3 rounded text-black"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border p-3 rounded text-black"
          />

          <button
            type="submit"
            className="w-full bg-red-600 text-white p-3 rounded"
          >
            Create Account
          </button>

        </form>

        {message && (
          <p className="mt-4 text-black">
            {message}
          </p>
        )}

      </div>

    </main>
  );
}
