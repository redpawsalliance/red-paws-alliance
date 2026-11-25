"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RegistryPage() {
  const [dogs, setDogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadDogs();
  }, []);

  async function loadDogs() {
    const { data } = await supabase
      .from("donor_dogs")
      .select("*");

    setDogs(data || []);
  }

  const filteredDogs = dogs.filter((dog) => {
    const term = search.toLowerCase();

    return (
      dog.dog_name?.toLowerCase().includes(term) ||
      dog.owner_name?.toLowerCase().includes(term) ||
      dog.breed?.toLowerCase().includes(term) ||
      dog.blood_type?.toLowerCase().includes(term)
    );
  });

  return (
    <main className="min-h-screen bg-red-50 p-8">

      <h1 className="text-5xl font-bold text-red-700 mb-6">
        🐾 Donor Registry
      </h1>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search dog, owner, breed or blood type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xl border border-gray-300 rounded-lg p-4 bg-white text-black"
        />
      </div>

      <div className="space-y-4">

        {filteredDogs.map((dog) => (
          <Link
            key={dog.id}
            href={`/donor/${dog.id}`}
            className="block"
          >
            <div className="bg-white rounded-xl shadow p-6 hover:shadow-xl transition">

              <div className="grid md:grid-cols-2 gap-4">

                <div>

                  <h2 className="text-2xl font-bold text-black">
                    🐾 {dog.dog_name}
                  </h2>

                  <p className="text-black">
                    Owner: {dog.owner_name}
                  </p>

                  <p className="text-black">
                    Phone: {dog.phone}
                  </p>

                  <p className="text-black">
                    Email: {dog.email}
                  </p>

                </div>

                <div>

                  <p className="text-black">
                    Blood Type:
                    {" "}
                    <strong>
                      {dog.blood_type}
                    </strong>
                  </p>

                  <p className="text-black">
                    Breed: {dog.breed}
                  </p>

                  <p className="text-black">
                    Weight: {dog.weight} kg
                  </p>

                  <p className="text-black">
                    Availability:
                    {" "}
                    {dog.availability_status}
                  </p>

                </div>

              </div>

            </div>
          </Link>
        ))}

      </div>

    </main>
  );
}