"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        setEmail(user.email);
      }

      setLoading(false);
    }

    loadUser();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <nav className="bg-red-700 text-white shadow">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <div className="flex gap-6 items-center">

          <Link href="/">Home</Link>

          <Link href="/dashboard">
            Dashboard
          </Link>

          <Link href="/register">
            Register Donor
          </Link>

          <Link href="/registry">
            Donor Registry
          </Link>

          <Link href="/request-blood">
            Request Blood
          </Link>

          <Link href="/requests">
            Requests
          </Link>

          <Link href="/matches">
            Matches
          </Link>

          <Link href="/availability">
            Availability
          </Link>

          <Link href="/donations">
            Donations
          </Link>

        </div>

        <div>
          {!loading && email ? (
            <div className="flex gap-4 items-center">

              <span className="text-sm">
                {email}
              </span>

              <button
                onClick={logout}
                className="bg-white text-red-700 px-3 py-1 rounded"
              >
                Logout
              </button>

            </div>
          ) : (
            <div className="flex gap-4">

              <Link href="/login">
                Login
              </Link>

              <Link href="/signup">
                Sign Up
              </Link>

              <Link href="/eligibility">
  Eligibility
</Link>

<Link href="/review">
  Review
</Link>

<Link href="/audit">
  Audit
</Link>

<Link href="/match-history">
  Match History
</Link>

            </div>
          )}
        </div>

      </div>
    </nav>
  );
}