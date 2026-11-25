"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    const { data } = await supabase
      .from("audit_log")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setLogs(data || []);
  }

  return (
    <main className="min-h-screen bg-red-50 p-8">

      <h1 className="text-5xl font-bold text-red-700 mb-8">
        📋 Audit Log
      </h1>

      <div className="space-y-4">

        {logs.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6 text-black">
            No audit records yet.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="bg-white rounded-xl shadow p-4"
            >
              <p className="text-black">
                <strong>Action:</strong>{" "}
                {log.action}
              </p>

              <p className="text-black">
                <strong>Entity:</strong>{" "}
                {log.entity_name}
              </p>

              <p className="text-black">
                <strong>User:</strong>{" "}
                {log.performed_by}
              </p>

              <p className="text-black">
                <strong>Date:</strong>{" "}
                {log.created_at}
              </p>
            </div>
          ))
        )}

      </div>

    </main>
  );
}