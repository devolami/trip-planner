import { ErrorResponse } from "@/client/components";
import { RouteProvider } from "@/client/contexts";
export default function Page(){
  return (
    <RouteProvider>
      <ErrorResponse></ErrorResponse>
    </RouteProvider>

  )
}