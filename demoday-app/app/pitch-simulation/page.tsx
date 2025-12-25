import { withAuth } from "@workos-inc/authkit-nextjs";
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
      <PitchSimulationClient
        autoStart={autoStart}
        duration={duration}
        user={user}
      />
    </div>
  );
}
