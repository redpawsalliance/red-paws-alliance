"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RequestBloodPage() {
  const [clinicName, setClinicName] = useState("");
  const [vetName, setVetName] = useState("");
  const [phone, setPhone] = useState("");
  const [patientName, setPatientName] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [urgency, setUrgency] = useState("High");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase
      .from("blood_requests")
      .insert([
        {
          clinic_name: clinicName,
          vet_name: vetName,
          phone: phone,
          patient_name: patientName,
          blood_type_required: bloodType,
          urgency: urgency,
        },
      ]);

    if (error) {
      setMessage(`❌ ${error.message}`);
      return;
    }

    setMessage("✅ Blood request submitted");

    setClinicName("");
    setVetName("");
    setPhone("");
    setPatientName("");
    setBloodType("");
    setUrgency("High");
  }

  return (
    <main className="min-h-screen bg-red-50 p-8">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-5xl font-bold text-red-700 mb-6">
          🚑 Blood Request
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow space-y-4"
        >
          <input
            className="w-full border p-4 rounded text-black"
            placeholder="Clinic Name"
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
          />

          <input
            className="w-full border p-4 rounded text-black"
            placeholder="Veterinarian Name"
            value={vetName}
            onChange={(e) => setVetName(e.target.value)}
          />

          <input
            className="w-full border p-4 rounded text-black"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            className="w-full border p-4 rounded text-black"
            placeholder="Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
          />

          <input
            className="w-full border p-4 rounded text-black"
            placeholder="Required Blood Type"
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
          />

          <select
            className="w-full border p-4 rounded text-black"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>

          <button
            type="submit"
            className="w-full bg-red-600 text-white p-4 rounded"
          >
            Submit Blood Request
          </button>
        </form>

        {message && (
          <div className="mt-4 text-green-700 font-semibold">
            {message}
          </div>
        )}

      </div>
    </main>
  );
}