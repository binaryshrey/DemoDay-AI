import { withAuth } from "@workos-inc/authkit-nextjs";
import ProfileMenu from "../../components/view/ProfileMenu";
import PitchSimulationClient from "../../components/view/PitchSimulationClient";

export default async function PitchSimulation({
  searchParams,
}: {
  searchParams: { autoStart?: string; duration?: string };
}) {
  const { user } = await withAuth();

  if (!user) return null;

  // Always auto-start unless explicitly disabled
  const autoStart = searchParams.autoStart !== "false";
  const duration = searchParams.duration
    ? parseFloat(searchParams.duration)
    : 2; // Default 2 minutes

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-6 left-6">
        <a href="/dashboard" className="block">
          <img
            className="h-10 drop-shadow-lg"
            src="/logo-light.svg"
            alt="demoday-ai"
          />
        </a>
      </div>

      <div className="absolute top-6 right-6">
        <ProfileMenu user={user} />
      </div>

      <PitchSimulationClient autoStart={autoStart} duration={duration} />
    </div>
  );
}
