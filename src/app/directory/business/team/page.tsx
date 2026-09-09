import { Metadata } from "next";
import TeamView from "@/components/directory/business-panel/views/TeamView";

export const metadata: Metadata = {
  title: "Equipo — CareDriver",
};

export default function BusinessTeamPage() {
  return <TeamView />;
}
