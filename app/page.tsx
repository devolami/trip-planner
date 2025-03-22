import type { Metadata } from "next";
import { RouteProvider } from "@/client/contexts";
import { Home } from "@/client/components";


const siteURL: string = process.env.NEXT_PUBLIC_SITE_URL as string

export const metadata: Metadata = {
  metadataBase: new URL(siteURL),
  title: "Home | TripPlanner",
  description: "Plan your trip, generate map routes and logbook",
  alternates: {
    canonical: `${siteURL}`,
  },
}
export default function Page() {
  return (
    <RouteProvider>
      <div>        
        <Home />
      </div>
    </RouteProvider>
  );
}
