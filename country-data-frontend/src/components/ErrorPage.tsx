import React from "react";
import Link from "next/link";

const ErrorPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center p-6">
      <h1 className="text-5xl font-bold text-red-600">Oops!</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">
        Something went wrong. Please try again later.
      </p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default ErrorPage;
