"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EligibilityPage() {
  const [message, setMessage] = useState("");

  async function runEligibilityCheck() {
    const today = new Date();

    const { data: dogs, error } =
      await supabase
        .from("donor_dogs")
        .select("*");

    if (error) {
      setMessage(`❌ ${error.message}`);
      return;
    }

    let updatedCount = 0;

    for (const dog of dogs || []) {
      if (
        dog.next_eligible_date &&
        new Date(
          dog.next_eligible_date
        ) <= today
      ) {
        await supabase
          .from("donor_dogs")
          .update({
            availability_status:
              "Available",
          })
          .eq("id", dog.id);

        updatedCount++;
      }
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase
      .from("audit_log")
      .insert([
        {
          action:
            "Eligibility Check Run",
          entity_type:
            "System",
          entity_name:
            `${updatedCount} donor(s) reactivated`,
          performed_by:
            user?.email ||
            "Unknown",
        },
      ]);

    setMessage(
      `✅ Eligibility check complete. ${updatedCount} donor(s) reactivated.`
    );
  }

  return (
    <main className="min-h-screen bg-red-50 p-8">

      <h1 className="text-5xl font-bold text-red-700 mb-8">
        ✅ Eligibility Maintenance
      </h1>

      <div className="bg-white rounded-xl shadow p-8">

        <p className="text-black mb-6">
          Check all donors and
          reactivate eligible donors.
        </p>

        <button
          onClick={runEligibilityCheck}
          className="bg-red-600 text-white px-6 py-3 rounded"
        >
          Run Eligibility Check
        </button>

        {message && (
          <div className="mt-6 text-black">
            {message}
          </div>
        )}

      </div>

    </main>
  );
}