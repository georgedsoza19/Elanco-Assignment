import express from "express";
import {
  getAllCountries,
  getCountryByCode,
  getCountriesByRegion,
  searchCountries,
} from "../controllers/countryController";

const router = express.Router();

router.get("/search", searchCountries);
router.get("/", getAllCountries);
router.get("/region/:region", getCountriesByRegion);
router.get("/:code", getCountryByCode);

export default router;
