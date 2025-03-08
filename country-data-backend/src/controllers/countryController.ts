import { Request, Response } from "express";
import {
  fetchCountries,
  fetchCountryByCode,
  fetchCountriesByRegion,
  fetchSearchResults,
} from "../services/countryService";

export const getAllCountries = async (req: Request, res: Response) => {
  try {
    const countries = await fetchCountries();
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching countries" });
  }
};

export const getCountryByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const country = await fetchCountryByCode(code);
    res.json(country);
  } catch (error) {
    res.status(500).json({ message: "Error fetching country details" });
  }
};

export const getCountriesByRegion = async (req: Request, res: Response) => {
  try {
    const { region } = req.params;
    const countries = await fetchCountriesByRegion(region);
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching countries by region" });
  }
};

export const searchCountries = async (req: Request, res: Response) => {
  try {
    const query = req.query;
    const results = await fetchSearchResults(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Error searching for countries" });
  }
};
