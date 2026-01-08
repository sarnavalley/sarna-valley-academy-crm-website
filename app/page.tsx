export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
        Sarna Valley Academy
      </h1>

      <p className="mt-4 text-lg text-gray-600 max-w-xl">
        Nurturing excellence in academics, sports, and character.
      </p>

      <p className="mt-2 text-md text-gray-500">
        Official website launching soon.
      </p>

      <div className="mt-8 text-sm text-gray-400">
        © {new Date().getFullYear()} Sarna Valley Academy
      </div>
    </main>
  );
}
