import CustomLogo from '@/components/customLogo';

export default function Home() {
  return (
    <>
      <CustomLogo />
      <main
        className="min-h-screen flex flex-col items-center px-6 text-center"
        style={{
          background:
            'linear-gradient(to bottom, #0e1b3a 0%, #0e1b3a 20%, #182F66 80%)',
        }}
      >
        {/* <main className="min-h-screen flex flex-col items-center bg-linear-to-b via-[#0e1b3a] to-[#182F66] #FCE036 px-6 text-center "> */}
        {/* Curved logo section */}
        {/* Existing content */}
        <h1 className="mt-100 text-4xl md:text-5xl font-bold text-gray-100">
          Sarna Valley Academy
        </h1>

        <p className="mt-4 text-lg text-gray-300 max-w-xl">
          Nurturing excellence in academics, sports, and character.
        </p>

        <p className="mt-2 text-md text-gray-400">
          Official website launching soon.
        </p>

        <div className="mt-8 text-sm text-gray-500">
          © {new Date().getFullYear()} Sarna Valley Academy
        </div>
      </main>
    </>
  );
}
