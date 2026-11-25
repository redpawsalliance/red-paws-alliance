"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MatchHistoryPage() {
  const [matches, setMatches] =
    useState<any[]>([]);

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    const { data } = await supabase
      .from("blood_matches")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    const enriched =
      await Promise.all(
        (data || []).map(
          async (match) => {
            const {
              data: donor,
            } = await supabase
              .from("donor_dogs")
              .select("*")
              .eq(
                "id",
                match.donor_id
              )
              .single();

            const {
              data: request,
            } = await supabase
              .from("blood_requests")
              .select("*")
              .eq(
                "id",
                match.request_id
              )
              .single();

            return {
              ...match,
              donor,
              request,
            };
          }
        )
      );

    setMatches(enriched);
  }

  async function updateMatch(
    match: any,
    status: string,
    notes: string
  ) {
    await supabase
      .from("blood_matches")
      .update({
        status,
        notes,
      })
      .eq("id", match.id);

    let requestStatus =
      null;

    if (
      status ===
      "Accepted"
    ) {
      requestStatus =
        "Matched";

      await supabase
        .from("donor_dogs")
        .update({
          availability_status:
            "Reserved",
        })
        .eq(
          "id",
          match.donor_id
        );
    }

    if (
      status ===
      "Declined"
    ) {
      requestStatus =
        "Matching";

      await supabase
        .from("donor_dogs")
        .update({
          availability_status:
            "Available",
        })
        .eq(
          "id",
          match.donor_id
        );
    }

    if (
      status ===
      "Completed"
    ) {
      requestStatus =
        "Completed";

      const today =
        new Date();

      const nextEligible =
        new Date();

      nextEligible.setDate(
        today.getDate() +
          56
      );

      const donationDate =
        today
          .toISOString()
          .split("T")[0];

      const nextEligibleDate =
        nextEligible
          .toISOString()
          .split("T")[0];

      await supabase
        .from("donations")
        .insert([
          {
            donor_id:
              match.donor_id,
            volume_ml:
              450,
            notes:
              "Auto-generated from completed match",
            donation_date:
              donationDate,
          },
        ]);

      await supabase
        .from("donor_dogs")
        .update({
          availability_status:
            "Unavailable",

          last_donation_date:
            donationDate,

          next_eligible_date:
            nextEligibleDate,
        })
        .eq(
          "id",
          match.donor_id
        );
    }

    if (
      requestStatus
    ) {
      await supabase
        .from(
          "blood_requests"
        )
        .update({
          status:
            requestStatus,
        })
        .eq(
          "id",
          match.request_id
        );
    }

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    await supabase
      .from("audit_log")
      .insert([
        {
          action: `Match ${status}`,
          entity_type:
            "Blood Match",
          entity_name:
            match.request
              ?.patient_name ||
            "Unknown",
          performed_by:
            user?.email ||
            "Unknown",
        },
      ]);

    loadMatches();
  }

  return (
    <main className="min-h-screen bg-red-50 p-8">

      <h1 className="text-5xl font-bold text-red-700 mb-8">
        📋 Match History
      </h1>

      <div className="space-y-5">

        {matches.map(
          (match) => (
            <MatchCard
              key={
                match.id
              }
              match={
                match
              }
              updateMatch={
                updateMatch
              }
            />
          )
        )}

      </div>

    </main>
  );
}

function MatchCard({
  match,
  updateMatch,
}: any) {
  const [status, setStatus] =
    useState(
      match.status ||
        "Pending Contact"
    );

  const [notes, setNotes] =
    useState(
      match.notes || ""
    );

  return (
    <div className="bg-white rounded-xl shadow p-6">

      <p className="text-black">
        <strong>
          Patient:
        </strong>{" "}
        {
          match.request
            ?.patient_name
        }
      </p>

      <p className="text-black">
        <strong>
          Donor:
        </strong>{" "}
        {
          match.donor
            ?.dog_name
        }
      </p>

      <p className="text-green-700 font-bold">
        Score:
        {" "}
        {
          match.score
        }
      </p>

      <select
        value={status}
        onChange={(e) =>
          setStatus(
            e.target.value
          )
        }
        className="border rounded p-3 mt-4 text-black"
      >
        <option>
          Pending Contact
        </option>

        <option>
          Contacted
        </option>

        <option>
          Accepted
        </option>

        <option>
          Declined
        </option>

        <option>
          Completed
        </option>

      </select>

      <textarea
        value={notes}
        onChange={(e) =>
          setNotes(
            e.target.value
          )
        }
        placeholder="Coordinator notes..."
        className="w-full border rounded p-3 mt-4 text-black"
        rows={4}
      />

      <button
        onClick={() =>
          updateMatch(
            match,
            status,
            notes
          )
        }
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        Save Match
      </button>

    </div>
  );
}