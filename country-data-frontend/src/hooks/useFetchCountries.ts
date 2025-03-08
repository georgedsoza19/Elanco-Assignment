import { useState, useEffect } from "react";
import axios from "axios";
import { Country } from "../pages";

const useFetchCountries = (dynamicPath: string = "") => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3001/countries${dynamicPath ? dynamicPath : ""}`)
      .then((res) => {
        setCountries(res.data);
        setLoading(false);
      })
      .catch(() => setError(true));
  }, [dynamicPath]);

  return { countries, loading, error };
};

export default useFetchCountries;
