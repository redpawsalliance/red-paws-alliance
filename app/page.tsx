export default function Home() {
  return (
    <main className="min-h-screen bg-red-50">
      <div className="max-w-6xl mx-auto px-8 py-20">

        <h1 className="text-6xl font-bold text-red-700 mb-6">
          🐾 Red Paws Alliance
        </h1>

        <p className="text-2xl text-gray-700 mb-10">
          Connecting canine blood donors with dogs in need.
        </p>

        <div className="flex flex-wrap gap-4 mb-20">
          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg">
            Register As Donor
          </button>

          <button className="border border-red-600 text-red-600 px-8 py-4 rounded-lg">
            Request Blood
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-bold mb-3">
              Donor Registry
            </h2>

            <p>
              Register eligible donor dogs and manage donor profiles.
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-bold mb-3">
              Emergency Requests
            </h2>

            <p>
              Veterinary clinics can create urgent blood requests.
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-bold mb-3">
              Smart Matching
            </h2>

            <p>
              Match donor dogs with recipient dogs in need.
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}