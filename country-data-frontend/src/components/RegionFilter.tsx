import React, { useState } from "react";

interface RegionFilterProps {
  setRegionPath: (path: string) => void;
}

const regions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

const RegionFilter: React.FC<RegionFilterProps> = ({ setRegionPath }) => {
  const [region, setRegion] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setRegion(value);
    let path = "";
    if (value) path += `/region/${value}`;
    setRegionPath(path);
  };

  return (
    <div className="w-full md:max-w-sm">
      <select
        value={region}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
      >
        <option value="">All Regions</option>
        {regions.map((reg) => (
          <option key={reg} value={reg}>
            {reg}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RegionFilter;
