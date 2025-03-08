import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { Country } from "../pages";

export interface CountryCardProps {
  country: Country;
}

const CountryCard: React.FC<CountryCardProps> = ({ country }) => {
  const router = useRouter();
  const timeRef = useRef<HTMLParagraphElement>(null);

  // ✅ Function to dynamically convert UTC Offset to Local Time
  const updateTime = () => {
    if (!country.timezone) return;

    const match = country.timezone.match(/UTC([+-]\d{2}:\d{2})/);

    if (!match) {
      if (timeRef.current) timeRef.current.innerText = "Invalid Timezone";
      return;
    }

    const [hours, minutes] = match[1].split(":");
    const offsetMs = (parseInt(hours) * 60 + parseInt(minutes)) * 60000;
    const localTime = new Date(Date.now() + offsetMs);

    if (timeRef.current) {
      timeRef.current.innerText = localTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
  };

  // ✅ Update time every second without re-rendering
  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [country.timezone]);

  const handleClick = () => {
    router.push(`/countries/${country.code}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
      <div className="relative w-full h-40">
        <Image
          src={country.flag}
          alt={country.name}
          className="object-cover"
          fill={true}
          priority={false}
        />
      </div>
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {country.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          🌍 {country.region}
        </p>
        <p
          ref={timeRef}
          className="text-gray-600 dark:text-gray-300 text-sm mt-1"
        >
          ⏰ Current Time: --
        </p>
      </div>
      <div className="px-4 pb-4 text-center">
        <button
          onClick={handleClick}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default CountryCard;
