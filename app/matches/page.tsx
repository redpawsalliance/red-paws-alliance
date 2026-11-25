"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MatchesPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    const { data } = await supabase
      .from("blood_requests")
      .select("*");

    setRequests(data || []);
  }

  async function findMatches(
    request: any
  ) {
    const { data } = await supabase
      .from("donor_dogs")
      .select("*")
      .eq(
        "blood_type",
        request.blood_type_required
      )
      .eq(
        "availability_status",
        "Available"
      )
      .eq(
        "review_status",
        "Approved"
      );

    const today = new Date();

    const eligibleDogs = (data || []).filter(
      (dog) => {
        if (!dog.next_eligible_date) {
          return true;
        }

        return (
          new Date(
            dog.next_eligible_date
          ) <= today
        );
      }
    );

    const scoredMatches =
      eligibleDogs.map((dog) => {
        let score = 50;

        if (
          dog.weight >= 25
        )
          score += 20;

        if (
          dog.weight >= 35
        )
          score += 10;

        if (dog.phone)
          score += 10;

        if (dog.email)
          score += 10;

        return {
          ...dog,
          score,
        };
      });

    setMatches(
      scoredMatches.sort(
        (a, b) =>
          b.score - a.score
      )
    );

    for (const match of scoredMatches) {
      await supabase
        .from("blood_matches")
        .insert([
          {
            request_id:
              request.id,
            donor_id:
              match.id,
            score:
              match.score,
          },
        ]);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase
      .from("audit_log")
      .insert([
        {
          action:
            "Matches Generated",
          entity_type:
            "Blood Request",
          entity_name:
            request.patient_name,
          performed_by:
            user?.email ||
            "Unknown",
        },
      ]);

    setMessage(
      `✅ ${scoredMatches.length} match(es) saved`
    );
  }

  return (
    <main className="min-h-screen bg-red-50 p-8">

      <h1 className="text-6xl font-bold text-red-700 mb-8">
        🩸 Match Donors
      </h1>

      {message && (
        <div className="bg-white rounded-lg shadow p-4 mb-6 text-black">
          {message}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-10">

        <div>

          <h2 className="text-3xl font-bold mb-6 text-black">
            Blood Requests
          </h2>

          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-xl shadow p-6 mb-4"
            >

              <p className="text-black">
                <strong>Patient:</strong>{" "}
                {request.patient_name}
              </p>

              <p className="text-black">
                <strong>Blood Type:</strong>{" "}
                {request.blood_type_required}
              </p>

              <button
                onClick={() =>
                  findMatches(
                    request
                  )
                }
                className="mt-4 bg-red-600 text-white px-5 py-3 rounded"
              >
                Generate Matches
              </button>

            </div>
          ))}

        </div>

        <div>

          <h2 className="text-3xl font-bold mb-6 text-black">
            Generated Matches
          </h2>

          {matches.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-6 text-black">
              No matches generated.
            </div>
          ) : (
            matches.map(
              (dog) => (
                <div
                  key={dog.id}
                  className="bg-white rounded-xl shadow p-6 mb-4"
                >

                  <h3 className="text-2xl font-bold text-black">
                    🐾{" "}
                    {
                      dog.dog_name
                    }
                  </h3>

                  <p className="text-green-700 font-bold">
                    Score:
                    {" "}
                    {
                      dog.score
                    }
                    /100
                  </p>

                  <p className="text-black">
                    Owner:
                    {" "}
                    {
                      dog.owner_name
                    }
                  </p>

                  <p className="text-black">
                    Phone:
                    {" "}
                    {
                      dog.phone
                    }
                  </p>

                </div>
              )
            )
          )}

        </div>

      </div>

    </main>
  );
}