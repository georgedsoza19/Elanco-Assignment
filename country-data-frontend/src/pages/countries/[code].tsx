import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import Loader from "@/src/components/Loader";

const CountryDetail = () => {
  const router = useRouter();
  const { code } = router.query;
  const [country, setCountry] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (code) {
      axios
        .get(`http://localhost:3001/countries/${code}`)
        .then((response) => {
          setCountry(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching country:", error);
          setLoading(false);
        });
    }
  }, [code]);

  if (!country)
    return (
      <p className="text-center text-lg text-red-500">Country not found</p>
    );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      {loading ? (
        <Loader />
      ) : (
        <div className="container mx-auto max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <Link
              href="/"
              className="inline-block text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ← Back to Home
            </Link>
          </div>

          <div className="relative w-full h-64 bg-gray-200 dark:bg-gray-700">
            <Image
              src={country?.flag}
              alt={country?.name}
              fill={true}
              priority={false}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="p-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {country?.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 text-gray-700 dark:text-gray-300">
              <div className="text-lg">
                <p>
                  <strong>🌍 Region: </strong> {country?.region}
                </p>
                <p>
                  <strong>🏙 Capital: </strong> {country?.capital}
                </p>
                <p>
                  <strong>👥 Population: </strong>
                  {country?.population}
                </p>
              </div>
              <div className="text-lg">
                {country.currency && (
                  <p>
                    <strong>💰 Currency: </strong>
                    {`${country?.currency?.name} (${country?.currency?.symbol})`}
                  </p>
                )}
                <p>
                  <strong>🕒 Timezone: </strong>
                  {country?.timezone}
                </p>
                {country.languages && (
                  <p>
                    <strong>🗣 Languages: </strong>
                    {Object.values(country.languages).slice(0, 2).join(", ")}
                  </p>
                )}
              </div>
            </div>

            {/* Explore More Button */}
            <div className="mt-6">
              <a
                href={`https://en.wikipedia.org/wiki/${country.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md transition"
              >
                Learn More →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryDetail;
