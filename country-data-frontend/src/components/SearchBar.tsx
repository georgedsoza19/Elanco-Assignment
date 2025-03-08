import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (path: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [search, setSearch] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("name");
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (debounceTimeout) clearTimeout(debounceTimeout);

    const delay = setTimeout(() => {
      let path = "";
      if (value) path += `/search?${filterType}=${value}`;
      onSearch(path);
    }, 500);

    setDebounceTimeout(delay);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value);
    setSearch("");
    onSearch("");
  };

  return (
    <div className="flex flex-row gap-3 items-center">
      <input
        type="text"
        className="w-full md:w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        placeholder={`Search by ${filterType}...`}
        value={search}
        onChange={handleSearch}
      />

      <select
        className="px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        value={filterType}
        onChange={handleFilterChange}
      >
        <option value="name">Name</option>
        <option value="capital">Capital</option>
        <option value="timezone">Timezone</option>
      </select>
    </div>
  );
};

export default SearchBar;
