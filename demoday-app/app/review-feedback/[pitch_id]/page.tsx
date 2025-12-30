import { withAuth } from "@workos-inc/authkit-nextjs";
import DashboardLayout from "@/components/view/DashboardLayout";
import ReviewFeedbackClient from "@/components/view/ReviewFeedbackClient";

interface Params {
  params: { pitch_id?: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

export default async function ReviewFeedbackPage({
  params,
  searchParams,
}: Params) {
  const { user } = await withAuth();

  if (!user) return null;

  return (
    <DashboardLayout user={user} currentPage="dashboard">
      <ReviewFeedbackClient
        params={params}
        searchParams={searchParams}
        user={user}
      />
    </DashboardLayout>
  );
}
