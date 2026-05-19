import StatCards from "@/components/dashboard/StatCards";
import ChartsSection from "@/components/dashboard/ChartsSection";
import RecentTickets from "@/components/dashboard/RecentTickets";

export default function DashboardView() {
  return (
    <div className="dashboard">
      <StatCards />
      <ChartsSection />
      <RecentTickets />
    </div>
  );
}
