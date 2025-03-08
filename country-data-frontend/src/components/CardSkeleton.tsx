import React from "react";

const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden animate-pulse">
      <div className="w-full h-40 bg-gray-300 dark:bg-gray-700"></div>
      <div className="p-4 text-center">
        <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mx-auto"></div>
        <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded mt-2 mx-auto"></div>
        <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded mt-1 mx-auto"></div>
      </div>
      <div className="px-4 pb-4 text-center">
        <div className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto"></div>
      </div>
    </div>
  );
};

export default CardSkeleton;
