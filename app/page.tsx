"use client";
import { RouteProvider } from "@/client/contexts";
import { Home } from "@/client/components/Home";
export default function Page() {
  
  return (
    <RouteProvider>
      <div>
        <Home/>
      </div>
    </RouteProvider>
  );
}
