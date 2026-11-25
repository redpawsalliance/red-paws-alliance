"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    const { data } = await supabase
      .from("blood_requests")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setRequests(data || []);
  }

  async function updateStatus(
    request: any,
    status: string
  ) {
    const { error } = await supabase
      .from("blood_requests")
      .update({
        status,
      })
      .eq("id", request.id);

    if (error) {
      setMessage(`❌ ${error.message}`);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase
      .from("audit_log")
      .insert([
        {
          action: `Request ${status}`,
          entity_type: "Blood Request",
          entity_name:
            request.patient_name,
          performed_by:
            user?.email ||
            "Unknown",
        },
      ]);

    setMessage(
      `✅ Status updated to ${status}`
    );

    loadRequests();
  }

  return (
    <main className="min-h-screen bg-red-50 p-8">

      <h1 className="text-5xl font-bold text-red-700 mb-8">
        🚑 Blood Request Dashboard
      </h1>

      {message && (
        <div className="bg-white rounded-lg shadow p-4 mb-6 text-black">
          {message}
        </div>
      )}

      <div className="space-y-5">

        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-xl shadow p-6"
          >

            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <p className="text-black">
                  <strong>Patient:</strong>{" "}
                  {request.patient_name}
                </p>

                <p className="text-black">
                  <strong>Blood Type:</strong>{" "}
                  {request.blood_type_required}
                </p>
              </div>

              <div>
                <p className="text-black">
                  <strong>Urgency:</strong>{" "}
                  {request.urgency}
                </p>

                <p className="text-black">
                  <strong>Status:</strong>{" "}
                  {request.status || "Open"}
                </p>
              </div>

            </div>

            <div className="flex gap-4 mt-5 flex-wrap">

              <select
                value={
                  request.status ||
                  "Open"
                }
                onChange={(e) =>
                  updateStatus(
                    request,
                    e.target.value
                  )
                }
                className="border border-gray-300 p-3 rounded bg-white text-black"
              >
                <option value="Open">
                  Open
                </option>

                <option value="Matching">
                  Matching
                </option>

                <option value="Matched">
                  Matched
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>

              </select>

              <Link
                href="/matches"
                className="bg-red-600 text-white px-5 py-3 rounded-lg"
              >
                View Matches
              </Link>

            </div>

          </div>
        ))}

      </div>

    </main>
  );
}