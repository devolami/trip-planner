"use client";
import { useRoute } from "@/client/contexts";
export default function ErrorResponse() {
  const { errorDataRef } = useRoute();
  const errorData = errorDataRef.current;
  console.log("This is coming from the error page: ", errorData);

  return (
    <div className="flex flex-col justify-center items-center">
      <p className="mt-20 text-4xl md:text-8xl">Oops!.... </p>
      <p className="text-xl m-auto p-4 text-gray-600 text-center mt-10">You might not have enough cycle hours to complete this trip or your inputs are incorrect.</p>
      <p className="text-xl m-auto p-4 text-gray-600 text-center mt-10">{errorData}</p>
    </div>
  );
}
