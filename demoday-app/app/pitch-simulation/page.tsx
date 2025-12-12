import { withAuth } from "@workos-inc/authkit-nextjs";
import ProfileMenu from "../../components/view/ProfileMenu";

export default async function PitchSimulation() {
  const { user } = await withAuth();

  if (!user) return null;

  return (
    <div
      className="relative z-10 min-h-screen"
      style={{ backgroundColor: "#FFE4DB" }}
    >
      <div className="px-6 pt-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <a href="/dashboard" className="-m-1.5 p-1.5">
            <img className="h-8" src="/demoday.svg" alt="demoday-ai" />
          </a>
          <div className="lg:flex lg:flex-1 lg:justify-end">
            <ProfileMenu user={user} />
          </div>
        </nav>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            AI Investor Pitch Simulation
          </h1>
          <p className="mt-4 text-md leading-4 text-gray-600">
            Practice your pitch with our AI-powered investor simulation
          </p>
        </div>

        <div className="mt-12">
          <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
            <div className="text-center text-gray-600">
              <p>Pitch simulation interface will be implemented here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
