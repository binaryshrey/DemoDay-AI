import { withAuth } from "@workos-inc/authkit-nextjs";
import FeedbackSessionClient from "@/components/view/FeedbackSessionClient";

export default async function Feedback() {
  const { user } = await withAuth();

  if (!user) return null;

  return (
    <div className="relative min-h-screen">
      <FeedbackSessionClient autoStart={true} user={user} />
    </div>
  );
}
