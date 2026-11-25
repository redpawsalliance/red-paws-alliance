"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [totalDonors, setTotalDonors] =
    useState(0);

  const [availableDonors, setAvailableDonors] =
    useState(0);

  const [totalRequests, setTotalRequests] =
    useState(0);

  const [criticalRequests, setCriticalRequests] =
    useState(0);

  const [totalMatches, setTotalMatches] =
    useState(0);

  const [completedMatches, setCompletedMatches] =
    useState(0);

  const [pendingContacts, setPendingContacts] =
    useState(0);

  const [auditLogs, setAuditLogs] =
    useState<any[]>([]);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    await loadDashboard();

    setLoading(false);
  }

  async function loadDashboard() {
    const { data: donors } =
      await supabase
        .from("donor_dogs")
        .select("*");

    const { data: requests } =
      await supabase
        .from("blood_requests")
        .select("*");

    const { data: matches } =
      await supabase
        .from("blood_matches")
        .select("*");

    const { data: logs } =
      await supabase
        .from("audit_log")
        .select("*")
        .order("created_at", {
          ascending: false,
        })
        .limit(5);

    setAuditLogs(logs || []);

    setTotalDonors(
      donors?.length || 0
    );

    setAvailableDonors(
      donors?.filter(
        (dog) =>
          dog.availability_status ===
          "Available"
      ).length || 0
    );

    setTotalRequests(
      requests?.length || 0
    );

    setCriticalRequests(
      requests?.filter(
        (r) =>
          r.urgency ===
          "Critical"
      ).length || 0
    );

    setTotalMatches(
      matches?.length || 0
    );

    setCompletedMatches(
      matches?.filter(
        (m) =>
          m.status ===
          "Completed"
      ).length || 0
    );

    setPendingContacts(
      matches?.filter(
        (m) =>
          m.status ===
          "Pending Contact"
      ).length || 0
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-red-50 p-8">

      <h1 className="text-6xl font-bold text-red-700 mb-10">
        📊 Red Paws Alliance Dashboard
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-black">
            Total Donors
          </h2>

          <p className="text-5xl font-bold text-red-700 mt-3">
            {totalDonors}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-black">
            Available Donors
          </h2>

          <p className="text-5xl font-bold text-green-600 mt-3">
            {availableDonors}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-black">
            Blood Requests
          </h2>

          <p className="text-5xl font-bold text-blue-600 mt-3">
            {totalRequests}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-black">
            Critical Requests
          </h2>

          <p className="text-5xl font-bold text-red-500 mt-3">
            {criticalRequests}
          </p>
        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-black">
            Total Matches
          </h2>

          <p className="text-5xl font-bold text-purple-600 mt-3">
            {totalMatches}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-black">
            Completed Matches
          </h2>

          <p className="text-5xl font-bold text-green-700 mt-3">
            {completedMatches}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-black">
            Pending Contacts
          </h2>

          <p className="text-5xl font-bold text-orange-600 mt-3">
            {pendingContacts}
          </p>
        </div>

      </div>

      <div className="mt-10 bg-white rounded-xl shadow p-6">

        <h2 className="text-2xl font-bold text-black mb-4">
          Recent Activity
        </h2>

        <div className="space-y-4">

          {auditLogs.map(
            (log) => (
              <div
                key={log.id}
                className="border rounded p-4"
              >

                <p className="text-black font-bold">
                  {log.action}
                </p>

                <p className="text-black">
                  {log.entity_name}
                </p>

                <p className="text-gray-600 text-sm">
                  {log.performed_by}
                </p>

              </div>
            )
          )}

        </div>

      </div>

    </main>
  );
}