import Features from "@/components/view/feat/Features";
import CTA from "@/components/view/CTA";
import Footer from "@/components/view/Footer";
import HeroSection from "../components/view/HeroSection";
import ToolCloud from "@/components/view/ToolCloud";
import {
  withAuth,
  getSignInUrl,
  getSignUpUrl,
} from "@workos-inc/authkit-nextjs";

export default async function Home() {
  const { user } = await withAuth();
  const signInUrl = await getSignInUrl();
  const signUpUrl = await getSignUpUrl();

  return (
    <div>
      <HeroSection user={user} signInUrl={signInUrl} signUpUrl={signUpUrl} />
      <ToolCloud />
      <Features />
      <CTA signInUrl={signInUrl} />
      <Footer />
    </div>
  );
}
