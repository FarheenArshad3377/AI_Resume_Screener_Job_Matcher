import LandingNavbar from "../components/LandingNavbar";
import HeroSection from "../components/HeroSection";
import StatsStrip from "../components/StatsStrip";
import FeaturedJobs from "../components/FeaturedJobs";
import LandingFooter from "../components/LandingFooter";

export default function HomePage() {
  return (
    <div className="rp-landing">
      <LandingNavbar />
      <HeroSection />
      <StatsStrip />
      <FeaturedJobs />
      <LandingFooter />
    </div>
  );
}
