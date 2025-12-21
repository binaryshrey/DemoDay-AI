import { withAuth } from "@workos-inc/authkit-nextjs";
import FeedbackSessionClient from "@/components/view/FeedbackSessionClient";
import ProfileMenuWrapper from "@/components/view/ProfileMenuWrapper";

export default async function Feedback() {
  const { user } = await withAuth();

  if (!user) return null;

  return (
    <>
      {/* Header - Fixed at top */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <img className="h-10" src="/logo-light.svg" alt="demoday-ai" />
            <ProfileMenuWrapper />
          </div>
        </div>
      </header>

      {/* Feedback Session - Full Screen */}
      <FeedbackSessionClient autoStart={true} />
    </>
  );
}
