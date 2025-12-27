import { withAuth } from "@workos-inc/authkit-nextjs";
import PitchSimulationClient from "../../components/view/PitchSimulationClient";

export default async function PitchSimulation({
  searchParams,
}: {
  searchParams: Promise<{ autoStart?: string; duration?: string }>;
}) {
  // In Next.js App Router, searchParams is a Promise in server components
  const resolvedSearchParams = await searchParams;

  const { user } = await withAuth();
  if (!user) return null;

  // Always auto-start unless explicitly disabled
  const autoStart = resolvedSearchParams?.autoStart !== "false";
  const duration = resolvedSearchParams?.duration
    ? parseFloat(resolvedSearchParams.duration)
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
