"use client"
export default function ErrorBoundary({error}:{error: Error}){
    console.log(error.message)
    return (
        <div className="mt-[150px] flex flex-col items-center justify-center">
            <p className="text-2xl font-bold mb-4">An error occurred!</p>
            <p className="text-red-800 font-bold text-xl m-10">Our technical team have been notified and are working on it. Be rest assured this will be fixed soon.</p>
            <p>Are you offline?</p>
            <p>Please connect to the internet and try again.</p>
        </div>
    )
}