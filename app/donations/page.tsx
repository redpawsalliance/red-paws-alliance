"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DonationsPage() {
  const [dogs, setDogs] = useState<any[]>([]);
  const [selectedDog, setSelectedDog] = useState("");
  const [clinic, setClinic] = useState("");
  const [volume, setVolume] = useState("");
  const [message, setMessage] = useState("");
  const [donations, setDonations] = useState<any[]>([]);

  useEffect(() => {
    loadDogs();
    loadDonations();
  }, []);

  async function loadDogs() {
    const { data } = await supabase
      .from("donor_dogs")
      .select("*")
      .order("dog_name");

    setDogs(data || []);
  }

  async function loadDonations() {
    const { data } = await supabase
      .from("donations")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setDonations(data || []);
  }

  async function recordDonation(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const { error } = await supabase
      .from("donations")
      .insert([
        {
          donor_id: selectedDog,
          clinic_id: null,
          volume_ml: Number(volume),
          notes: clinic,
          donation_date:
            new Date()
              .toISOString()
              .split("T")[0],
        },
      ]);

    if (error) {
      setMessage(`❌ ${error.message}`);
      return;
    }

    setMessage(
      "✅ Donation recorded successfully"
    );

    setClinic("");
    setVolume("");
    setSelectedDog("");

    loadDonations();
  }

  return (
    <main className="min-h-screen bg-red-50 p-8">

      <h1 className="text-5xl font-bold text-red-700 mb-8">
        🩸 Donation Tracking
      </h1>

      <div className="bg-white rounded-xl shadow p-6 mb-8">

        <form
          onSubmit={recordDonation}
          className="space-y-4"
        >

          <select
            value={selectedDog}
            onChange={(e) =>
              setSelectedDog(e.target.value)
            }
            className="w-full border p-3 rounded text-black"
          >
            <option value="">
              Select Donor
            </option>

            {dogs.map((dog) => (
              <option
                key={dog.id}
                value={dog.id}
              >
                {dog.dog_name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Clinic Name"
            value={clinic}
            onChange={(e) =>
              setClinic(e.target.value)
            }
            className="w-full border p-3 rounded text-black"
          />

          <input
            type="number"
            placeholder="Volume (ml)"
            value={volume}
            onChange={(e) =>
              setVolume(e.target.value)
            }
            className="w-full border p-3 rounded text-black"
          />

          <button
            type="submit"
            className="bg-red-600 text-white px-6 py-3 rounded"
          >
            Record Donation
          </button>

        </form>

        {message && (
          <div className="mt-4 text-black">
            {message}
          </div>
        )}

      </div>

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-2xl font-bold text-black mb-4">
          Donation History
        </h2>

        <div className="space-y-3">

          {donations.map(
            (donation) => (
              <div
                key={donation.id}
                className="border rounded p-4"
              >
                <p className="text-black">
                  Donation Date:
                  {" "}
                  {donation.donation_date}
                </p>

                <p className="text-black">
                  Clinic:
                  {" "}
                  {donation.notes}
                </p>

                <p className="text-black">
                  Volume:
                  {" "}
                  {donation.volume_ml} ml
                </p>
              </div>
            )
          )}

        </div>

      </div>

    </main>
  );
}