"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AvailabilityPage() {
  const [dogs, setDogs] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadDogs();
  }, []);

  async function loadDogs() {
    const { data } = await supabase
      .from("donor_dogs")
      .select("*");

    setDogs(data || []);
  }

  async function updateAvailability(
    id: string,
    status: string
  ) {
    const { error } = await supabase
      .from("donor_dogs")
      .update({
        availability_status: status,
      })
      .eq("id", id);

    if (error) {
      setMessage(`❌ ${error.message}`);
      return;
    }

    setMessage(`✅ Availability updated to ${status}`);

    loadDogs();
  }

  return (
    <main className="min-h-screen bg-red-50 p-8">

      <h1 className="text-5xl font-bold text-red-700 mb-8">
        🐾 Donor Availability
      </h1>

      {message && (
        <div className="bg-white p-4 rounded-lg shadow mb-6 text-black">
          {message}
        </div>
      )}

      <div className="space-y-4">

        {dogs.map((dog) => (
          <div
            key={dog.id}
            className="bg-white rounded-xl shadow p-6"
          >

            <h2 className="text-2xl font-bold text-black">
              {dog.dog_name}
            </h2>

            <p className="text-black">
              Owner: {dog.owner_name}
            </p>

            <p className="text-black">
              Blood Type: {dog.blood_type}
            </p>

            <p className="text-black mb-4">
              Current Status:
              <strong>
                {" "}
                {dog.availability_status}
              </strong>
            </p>

            <select
              value={dog.availability_status || ""}
              onChange={(e) =>
                updateAvailability(
                  dog.id,
                  e.target.value
                )
              }
              className="border border-gray-300 p-3 rounded bg-white text-black"
            >
              <option value="Available">
                Available
              </option>

              <option value="Unavailable">
                Unavailable
              </option>

              <option value="On Leave">
                On Leave
              </option>

              <option value="Reserved">
                Reserved
              </option>

            </select>

          </div>
        ))}

      </div>

    </main>
  );
}