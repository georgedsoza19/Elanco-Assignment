import { getCache, setCache } from "./../utils/cache";
import axios from "axios";

const BASE_URL = "https://restcountries.com/v3.1";

export const fetchCountries = async () => {
  const cacheKey = "all_countries";
  if (getCache(cacheKey)) return getCache(cacheKey);

  const response = await axios.get(`${BASE_URL}/all`);
  const countries = response.data.map((country: any) => ({
    name: country.name.common,
    flag: country.flags.svg,
    region: country.region,
    code: country.cca3,
    timezone: country.timezones[0],
  }));
  setCache(cacheKey, countries);

  return countries;
};

export const fetchCountryByCode = async (code: string) => {
  const cacheKey = `country_${code}`;
  if (getCache(cacheKey)) return getCache(cacheKey);

  const response = await axios.get(`${BASE_URL}/alpha/${code}`);
  const countryData = response.data[0];
  const country = {
    name: countryData.name.common,
    flag: countryData.flags.svg,
    population: countryData.population,
    languages: countryData.languages,
    region: countryData.region,
    currency: Object.values(countryData.currencies)[0],
    capital: countryData.capital[0],
    timezone: countryData.timezones[0],
  };

  setCache(cacheKey, country);
  return country;
};

export const fetchCountriesByRegion = async (region: string) => {
  const cacheKey = `region_${region}`;
  if (getCache(cacheKey)) return getCache(cacheKey);

  const response = await axios.get(`${BASE_URL}/region/${region}`);
  const countries = response.data.map((country: any) => ({
    name: country.name.common,
    flag: country.flags.svg,
    region: country.region,
    code: country.cca3,
    timezone: country.timezones[0],
  }));

  setCache(cacheKey, countries);
  return countries;
};

export const fetchSearchResults = async (query: any) => {
  let searchURL = `${BASE_URL}/all`;

  const { name, capital, region, timezone } = query;

  if (name) searchURL = `${BASE_URL}/name/${name}`;
  if (capital) searchURL = `${BASE_URL}/capital/${capital}`;
  if (region) searchURL = `${BASE_URL}/region/${region}`;
  if (timezone) searchURL = `${BASE_URL}/timezone/${timezone}`;

  const response = await axios.get(searchURL);
  const countries = response.data.map((country: any) => ({
    name: country.name.common,
    flag: country.flags.svg,
    region: country.region,
    code: country.cca3,
  }));
  return countries;
};
