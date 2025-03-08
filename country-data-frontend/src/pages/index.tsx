import { useState } from "react";
import CountryCard from "../components/CountryCard";
import SearchBar from "../components/SearchBar";
import RegionFilter from "../components/RegionFilter";
import useFetchCountries from "../hooks/useFetchCountries";
import CardSkeleton from "../components/CardSkeleton";
import ErrorPage from "../components/ErrorPage";

export interface Country {
  name: string;
  flag: string;
  region: string;
  code: string;
  timezone: string;
}

export default function Home() {
  const [queryParams, setQueryParams] = useState("");

  const { countries, loading, error } = useFetchCountries(queryParams);

  if (error) return <ErrorPage />;
  return (
    <div className="container mx-auto bg-gray-100 dark:bg-gray-900 h-screen flex flex-col">
      {/* Fixed Top Section */}
      <div className="flex-shrink-0 p-4">
        <h1 className="text-2xl font-bold text-white mb-6">
          Country Data Dashboard
        </h1>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <SearchBar
            onSearch={(params) => {
              setQueryParams(params);
            }}
          />
          <RegionFilter
            setRegionPath={(params) => {
              setQueryParams(params);
            }}
          />
        </div>
      </div>

      {/* Scrollable Section */}
      <div className="overflow-y-auto flex-grow p-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))
            : countries.map((country: Country) => (
                <CountryCard key={country.name} country={country} />
              ))}
        </div>
      </div>
    </div>
  );
}
