import Link from "next/link";

export function FailedComponent() {
    return (
        <div className="h-screen w-full flex items-center justify-center">
          <div className=" bg-gray-200 dark:bg-gray-950 shadow-md rounded-lg p-6  md:mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className=" h-20 w-20 text-red-600 mx-auto my-6"
              fill="currentColor"
              viewBox="0 -8 528 528"
            >
              <title>fail</title>
              <path d="M264 456Q210 456 164 429 118 402 91 356 64 310 64 256 64 202 91 156 118 110 164 83 210 56 264 56 318 56 364 83 410 110 437 156 464 202 464 256 464 310 437 356 410 402 364 429 318 456 264 456ZM264 288L328 352 360 320 296 256 360 192 328 160 264 224 200 160 168 192 232 256 168 320 200 352 264 288Z" />
            </svg>
  
            <div className="text-center">
              <h3 className="md:text-2xl text-base text-gray-900 dark:text-gray-200 font-semibold text-center">
                Payment Failed!
              </h3>
              <p className="text-gray-500 my-2">We are sorry, but your payment did not go through.</p>
              <p>Please try again later.</p>
              <div className="py-10 text-center">
                <Link
                  href="/"
                  className="px-12 bg-blue-600 rounded-full shadow-md hover:bg-blue-500 text-white font-semibold py-3"
                >
                  GO BACK
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
}