import { ErrorResponse } from "@/client/components";
import { RouteProvider } from "@/client/contexts";
import type { Metadata } from "next";

const siteURL: string = process.env.NEXT_PUBLIC_SITE_URL as string

export const metadata: Metadata = {
  metadataBase: new URL(siteURL),
  title: "Error | TripPlanner",
  description: "You might not have enough cycle hours to complete this trip or your inputs are incorrect.",
  alternates: {
    canonical: `${siteURL}/error-response`,
  },
}

export default function Page(){
  return (
    <RouteProvider>
      <ErrorResponse></ErrorResponse>
    </RouteProvider>

  )
}