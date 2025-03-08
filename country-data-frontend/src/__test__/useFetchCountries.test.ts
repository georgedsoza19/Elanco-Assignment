import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import useFetchCountries from "../hooks/useFetchCountries";
import { Country } from "../pages";
import { vi } from "vitest";

// Mock axios
vi.mock("axios");

// Mock response data
const mockCountries: Country[] = [
  {
    name: "India",
    code: "IN",
    flag: "https://flagcdn.com/in.svg",
    region: "Asia",
    timezone: "UTC+05:30",
  },
  {
    name: "United States",
    code: "US",
    flag: "https://flagcdn.com/us.svg",
    region: "Americas",
    timezone: "UTC-05:00",
  },
];

describe("useFetchCountries hook", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch countries data successfully and set countries", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockCountries });

    const { result } = renderHook(() => useFetchCountries());

    expect(result.current.loading).toBe(true);

    // ✅ Wait for the hook to fetch data
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.countries).toEqual(mockCountries);
      expect(result.current.error).toBe(false);
    });

    // ✅ Check if API was called
    expect(axios.get).toHaveBeenCalledWith("http://localhost:3001/countries");
  });

  it("should call API with dynamicPath when provided", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockCountries });

    const { result } = renderHook(() =>
      useFetchCountries("/search?name=India")
    );

    expect(result.current.loading).toBe(true);

    // ✅ Wait for the hook to fetch data
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.countries).toEqual(mockCountries);
      expect(result.current.error).toBe(false);
    });

    // ✅ Verify the dynamicPath was used
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3001/countries/search?name=India"
    );
  });

  it("should handle error state when API fails", async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const { result } = renderHook(() => useFetchCountries());

    expect(result.current.loading).toBe(true);

    // ✅ Wait for the hook to fetch data
    await waitFor(() => {
      expect(result.current.loading).toBe(true);
      expect(result.current.countries).toEqual([]);
      expect(result.current.error).toBe(true);
    });

    // ✅ Verify API call was made
    expect(axios.get).toHaveBeenCalledWith("http://localhost:3001/countries");
  });

  it("should call API without dynamicPath if none provided", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockCountries });

    const { result } = renderHook(() => useFetchCountries(""));

    expect(result.current.loading).toBe(true);

    // ✅ Wait for data to be fetched
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.countries).toEqual(mockCountries);
      expect(result.current.error).toBe(false);
    });

    // ✅ Verify API was called without dynamicPath
    expect(axios.get).toHaveBeenCalledWith("http://localhost:3001/countries");
  });

  it("should reset countries when dynamicPath changes", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockCountries });

    const { result, rerender } = renderHook(
      ({ path }) => useFetchCountries(path),
      {
        initialProps: { path: "" },
      }
    );

    // ✅ First API call without path
    await waitFor(() => {
      expect(result.current.countries).toEqual(mockCountries);
    });

    // ✅ Change dynamicPath to "/region/Asia"
    (axios.get as jest.Mock).mockResolvedValue({ data: [mockCountries[0]] });
    rerender({ path: "/region/Asia" });

    // ✅ Wait for the new API call
    await waitFor(() => {
      expect(result.current.countries).toEqual([mockCountries[0]]);
    });

    // ✅ Verify both API calls
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(axios.get).toHaveBeenCalledWith(
      "http://localhost:3001/countries/region/Asia"
    );
  });
});
