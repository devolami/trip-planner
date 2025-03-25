"use client";
import { useRoute } from "@/client/contexts";
import Link from "next/link";
export default function ErrorResponse() {
  const { errorDataRef } = useRoute();
  const errorData = errorDataRef.current;
 
  return (
    <div className="flex flex-col justify-center items-center">
      <p className="mt-20 text-4xl md:text-8xl">Oops!.... </p>
      <p className="text-xl m-auto p-4 text-gray-600 text-center mt-10">You might not have enough cycle hours to complete this trip or your inputs are incorrect.</p>
      <p className="text-xl m-auto p-4 text-gray-600 text-center mt-10">{errorData}</p>
      <Link  className="py-[12px] px-[20px] inline-block items-center justify-center bg-[#9E77ED] mt-[10px] text-white disabled:bg-gray-600" href={'/'} >Go back home</Link>
    </div>
  );
}
