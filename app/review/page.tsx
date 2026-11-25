"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ReviewPage() {
  const [dogs, setDogs] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadDogs();
  }, []);

  async function loadDogs() {
    const { data } = await supabase
      .from("donor_dogs")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setDogs(data || []);
  }

  async function updateStatus(
    dog: any,
    status: string
  ) {
    const { error } = await supabase
      .from("donor_dogs")
      .update({
        review_status: status,
      })
      .eq("id", dog.id);

    if (error) {
      setMessage(
        `❌ ${error.message}`
      );
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase
      .from("audit_log")
      .insert([
        {
          action: `Donor ${status}`,
          entity_type: "Donor",
          entity_name: dog.dog_name,
          performed_by:
            user?.email ||
            "Unknown",
        },
      ]);

    setMessage(
      `✅ ${dog.dog_name} marked as ${status}`
    );

    loadDogs();
  }

  return (
    <main className="min-h-screen bg-red-50 p-8">

      <h1 className="text-5xl font-bold text-red-700 mb-8">
        📝 Donor Review Queue
      </h1>

      {message && (
        <div className="bg-white rounded-lg shadow p-4 mb-6 text-black">
          {message}
        </div>
      )}

      <div className="space-y-5">

        {dogs.map((dog) => (
          <div
            key={dog.id}
            className="bg-white rounded-xl shadow p-6"
          >

            <div className="grid md:grid-cols-2 gap-6">

              <div>

                <p className="text-black">
                  <strong>Dog:</strong>{" "}
                  {dog.dog_name}
                </p>

                <p className="text-black">
                  <strong>Owner:</strong>{" "}
                  {dog.owner_name}
                </p>

                <p className="text-black">
                  <strong>Blood Type:</strong>{" "}
                  {dog.blood_type}
                </p>

              </div>

              <div>

                <p className="text-black">
                  <strong>
                    Current Status:
                  </strong>{" "}
                  {dog.review_status ||
                    "Pending"}
                </p>

              </div>

            </div>

            <div className="flex gap-4 mt-5 flex-wrap">

              <button
                onClick={() =>
                  updateStatus(
                    dog,
                    "Approved"
                  )
                }
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Approve
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    dog,
                    "Rejected"
                  )
                }
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    dog,
                    "Suspended"
                  )
                }
                className="bg-yellow-600 text-white px-4 py-2 rounded"
              >
                Suspend
              </button>

            </div>

          </div>
        ))}

      </div>

    </main>
  );
}