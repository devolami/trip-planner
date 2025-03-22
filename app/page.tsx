import { RouteProvider } from "@/client/contexts";
import { Home } from "@/client/components";
export default function Page() {
  
  return (
    <RouteProvider>
      <div>
        <Home/>
      </div>
    </RouteProvider>
  );
}
