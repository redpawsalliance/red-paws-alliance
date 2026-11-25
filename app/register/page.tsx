"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dogName, setDogName] = useState("");
  const [breed, setBreed] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [weight, setWeight] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase
      .from("donor_dogs")
      .insert([
        {
          owner_name: ownerName,
          phone: phone,
          email: email,
          dog_name: dogName,
          breed: breed,
          blood_type: bloodType,
          weight: Number(weight),
           availability_status: "Available",
        },
      ]);

    if (error) {
      setMessage(`❌ ${error.message}`);
      return;
    }

    setMessage("✅ Donor registered successfully");

    setOwnerName("");
    setPhone("");
    setEmail("");
    setDogName("");
    setBreed("");
    setBloodType("");
    setWeight("");
  }

  return (
    <main className="min-h-screen bg-red-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-5xl font-bold text-red-700 text-center mb-3">
          🐾 Register Donor Dog
        </h1>

        <p className="text-center text-gray-700 mb-8">
          Join the Red Paws Alliance donor network.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-5"
        >

          <input
            type="text"
            placeholder="Owner Name"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            className="w-full border border-gray-300 p-4 rounded-lg bg-white text-black placeholder:text-gray-500"
            required
          />

          <input
            type="tel"
            placeholder="Mobile Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 p-4 rounded-lg bg-white text-black placeholder:text-gray-500"
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-4 rounded-lg bg-white text-black placeholder:text-gray-500"
            required
          />

          <hr className="my-4" />

          <input
            type="text"
            placeholder="Dog Name"
            value={dogName}
            onChange={(e) => setDogName(e.target.value)}
            className="w-full border border-gray-300 p-4 rounded-lg bg-white text-black placeholder:text-gray-500"
            required
          />

          <input
            type="text"
            placeholder="Breed"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            className="w-full border border-gray-300 p-4 rounded-lg bg-white text-black placeholder:text-gray-500"
          />

          <input
            type="text"
            placeholder="Blood Type (DEA 1 Positive / DEA 1 Negative)"
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
            className="w-full border border-gray-300 p-4 rounded-lg bg-white text-black placeholder:text-gray-500"
          />

          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full border border-gray-300 p-4 rounded-lg bg-white text-black placeholder:text-gray-500"
          />

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-lg transition"
          >
            Register Donor
          </button>

        </form>

        {message && (
          <div className="mt-6 text-center">
            <p
              className={`font-semibold text-lg ${
                message.includes("❌")
                  ? "text-red-600"
                  : "text-green-700"
              }`}
            >
              {message}
            </p>
          </div>
        )}

      </div>
    </main>
  );
}