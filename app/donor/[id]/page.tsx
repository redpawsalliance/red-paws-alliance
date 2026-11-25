"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DonationsPage() {
  const [dogs, setDogs] = useState<any[]>([]);
  const [selectedDog, setSelectedDog] = useState("");
  const [clinic, setClinic] = useState("");
  const [volume, setVolume] = useState("");
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

  async function recordDonation(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const dog = dogs.find(
      (d) => d.id === selectedDog
    );

    const donationDate = new Date();

    const nextEligible = new Date();
    nextEligible.setDate(
      donationDate.getDate() + 56
    );

    const donationDateText =
      donationDate
        .toISOString()
        .split("T")[0];

    const nextEligibleText =
      nextEligible
        .toISOString()
        .split("T")[0];

    const donationResult =
      await supabase
        .from("donations")
        .insert([
          {
            donor_id:
              selectedDog,
            clinic_id: null,
            volume_ml:
              Number(volume),
            notes: clinic,
            donation_date:
              donationDateText,
          },
        ]);

    if (
      donationResult.error
    ) {
      setMessage(
        `❌ ${donationResult.error.message}`
      );
      return;
    }

    const donorUpdate =
      await supabase
        .from("donor_dogs")
        .update({
          last_donation_date:
            donationDateText,
          next_eligible_date:
            nextEligibleText,
          availability_status:
            "Unavailable",
        })
        .eq(
          "id",
          selectedDog
        );

    if (
      donorUpdate.error
    ) {
      setMessage(
        `❌ ${donorUpdate.error.message}`
      );
      return;
    }

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    await supabase
      .from("audit_log")
      .insert([
        {
          action:
            "Donation Recorded",
          entity_type:
            "Donor",
          entity_name:
            dog?.dog_name ||
            "Unknown",
          performed_by:
            user?.email ||
            "Unknown",
        },
      ]);

    setMessage(
      `✅ Donation recorded. Eligible again on ${nextEligibleText}`
    );

    setSelectedDog("");
    setClinic("");
    setVolume("");

    loadDogs();
  }

  return (
    <main className="min-h-screen bg-red-50 p-8">

      <h1 className="text-5xl font-bold text-red-700 mb-6">
        🩸 Donation Tracking
      </h1>

      <div className="bg-white rounded-xl p-6 shadow">

        <form
          onSubmit={
            recordDonation
          }
          className="space-y-4"
        >

          <select
            value={
              selectedDog
            }
            onChange={(e) =>
              setSelectedDog(
                e.target.value
              )
            }
            className="w-full border p-3 rounded text-black"
          >
            <option value="">
              Select Donor
            </option>

            {dogs.map(
              (dog) => (
                <option
                  key={
                    dog.id
                  }
                  value={
                    dog.id
                  }
                >
                  {
                    dog.dog_name
                  }
                </option>
              )
            )}
          </select>

          <input
            type="text"
            placeholder="Clinic Name"
            value={clinic}
            onChange={(e) =>
              setClinic(
                e.target.value
              )
            }
            className="w-full border p-3 rounded text-black"
          />

          <input
            type="number"
            placeholder="Volume (ml)"
            value={volume}
            onChange={(e) =>
              setVolume(
                e.target.value
              )
            }
            className="w-full border p-3 rounded text-black"
          />

          <button
            type="submit"
            className="bg-red-600 text-white px-5 py-3 rounded"
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

    </main>
  );
}