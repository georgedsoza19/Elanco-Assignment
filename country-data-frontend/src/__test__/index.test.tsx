import { render, screen, fireEvent } from "@testing-library/react";

import { vi } from "vitest";
import SearchBar from "../components/SearchBar";
import RegionFilter from "../components/RegionFilter";
import CountryCard from "../components/CountryCard";
import { Country } from "../pages";
import { useRouter } from "next/router";
import axios from "axios";

// Mock useRouter from next/router using vi.mock
vi.mock("next/router", () => ({
  useRouter: vi.fn(),
}));

vi.mock("axios");

describe("SearchBar Component", () => {
  let mockOnSearch: jest.Mock;

  beforeEach(() => {
    mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
  });

  it("should render input field and dropdown", () => {
    expect(
      screen.getByPlaceholderText("Search by name...")
    ).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("should call onSearch with correct path after debounce", async () => {
    const input = screen.getByPlaceholderText("Search by name...");

    fireEvent.change(input, { target: { value: "India" } });

    // Wait for debounce (500ms)
    await new Promise((r) => setTimeout(r, 600));

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith("/search?name=India");
  });

  it("should debounce the API call if input changes rapidly", async () => {
    const input = screen.getByPlaceholderText("Search by name...");

    fireEvent.change(input, { target: { value: "Ind" } });
    fireEvent.change(input, { target: { value: "India" } });

    // Wait for debounce (500ms)
    await new Promise((r) => setTimeout(r, 600));

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith("/search?name=India");
  });

  it("should clear search input when filter type changes", () => {
    const input = screen.getByPlaceholderText("Search by name...");
    const select = screen.getByRole("combobox");

    // Type something in input
    fireEvent.change(input, { target: { value: "Delhi" } });

    // Change filter type to "Capital"
    fireEvent.change(select, { target: { value: "capital" } });

    // Expect input value to reset
    expect(input).toHaveValue("");
    expect(mockOnSearch).toHaveBeenCalledWith("");
  });

  it("should update placeholder based on filter type", () => {
    const select = screen.getByRole("combobox");

    // Change to "Capital"
    fireEvent.change(select, { target: { value: "capital" } });
    expect(
      screen.getByPlaceholderText("Search by capital...")
    ).toBeInTheDocument();

    // Change to "Timezone"
    fireEvent.change(select, { target: { value: "timezone" } });
    expect(
      screen.getByPlaceholderText("Search by timezone...")
    ).toBeInTheDocument();
  });

  it("should not call onSearch if input is empty", async () => {
    const input = screen.getByPlaceholderText("Search by name...");

    // Type and then clear
    fireEvent.change(input, { target: { value: "India" } });
    fireEvent.change(input, { target: { value: "" } });

    // Wait for debounce
    await new Promise((r) => setTimeout(r, 600));

    expect(mockOnSearch).toHaveBeenCalledWith("");
  });

  it("should reset the search when filter type is changed", () => {
    const input = screen.getByPlaceholderText("Search by name...");
    const select = screen.getByRole("combobox");

    // Type something
    fireEvent.change(input, { target: { value: "Delhi" } });

    // Change filter type
    fireEvent.change(select, { target: { value: "capital" } });

    // Expect input to be empty
    expect(input).toHaveValue("");
    expect(mockOnSearch).toHaveBeenCalledWith("");
  });

  it("should debounce and call API after delay", async () => {
    const input = screen.getByPlaceholderText("Search by name...");

    fireEvent.change(input, { target: { value: "India" } });

    // Wait for less than debounce time
    await new Promise((r) => setTimeout(r, 300));

    // Should not have been called yet
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Wait for debounce to complete
    await new Promise((r) => setTimeout(r, 600));

    // Should now have been called
    expect(mockOnSearch).toHaveBeenCalledWith("/search?name=India");
  });

  it("should not call API if input is empty after debounce", async () => {
    const input = screen.getByPlaceholderText("Search by name...");

    // Type and then clear
    fireEvent.change(input, { target: { value: "India" } });
    fireEvent.change(input, { target: { value: "" } });

    // Wait for debounce
    await new Promise((r) => setTimeout(r, 600));

    expect(mockOnSearch).toHaveBeenCalledWith("");
  });

  it("should change URL based on filter type", async () => {
    const input = screen.getByPlaceholderText("Search by name...");
    const select = screen.getByRole("combobox");

    // Change filter type to "Capital"
    fireEvent.change(select, { target: { value: "capital" } });

    // Type something
    fireEvent.change(input, { target: { value: "Delhi" } });

    // Wait for debounce
    await new Promise((r) => setTimeout(r, 600));

    expect(mockOnSearch).toHaveBeenCalledWith("/search?capital=Delhi");
  });
});

describe("RegionFilter Component", () => {
  let mockSetRegionPath: jest.Mock;

  beforeEach(() => {
    mockSetRegionPath = vi.fn();
    render(<RegionFilter setRegionPath={mockSetRegionPath} />);
  });

  it("should render the dropdown with all region options", () => {
    expect(screen.getByRole("combobox")).toBeInTheDocument();

    const options = screen.getAllByRole("option");
    expect(options.length).toBe(6);
    expect(options[0].textContent).toBe("All Regions");
    expect(options[1].textContent).toBe("Africa");
    expect(options[2].textContent).toBe("Americas");
    expect(options[3].textContent).toBe("Asia");
    expect(options[4].textContent).toBe("Europe");
    expect(options[5].textContent).toBe("Oceania");
  });

  it("should call setRegionPath with correct path when a region is selected", () => {
    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: "Africa" } });
    expect(mockSetRegionPath).toHaveBeenCalledWith("/region/Africa");

    fireEvent.change(select, { target: { value: "Asia" } });
    expect(mockSetRegionPath).toHaveBeenCalledWith("/region/Asia");
  });

  it("should call setRegionPath with an empty path when 'All Regions' is selected", () => {
    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: "Africa" } });
    expect(mockSetRegionPath).toHaveBeenCalledWith("/region/Africa");

    fireEvent.change(select, { target: { value: "" } });
    expect(mockSetRegionPath).toHaveBeenCalledWith("");
  });

  it("should update the dropdown value when a region is selected", () => {
    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: "Asia" } });
    expect(select).toHaveValue("Asia");

    fireEvent.change(select, { target: { value: "Europe" } });
    expect(select).toHaveValue("Europe");
  });

  it("should not call setRegionPath if the same region is selected again", () => {
    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: "Europe" } });
    expect(mockSetRegionPath).toHaveBeenCalledWith("/region/Europe");

    fireEvent.change(select, { target: { value: "Europe" } });
    expect(mockSetRegionPath).toHaveBeenCalledTimes(1);
  });

  it("should reset the path when selecting 'All Regions'", () => {
    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: "Asia" } });
    expect(mockSetRegionPath).toHaveBeenCalledWith("/region/Asia");

    fireEvent.change(select, { target: { value: "" } });
    expect(mockSetRegionPath).toHaveBeenCalledWith("");
  });

  it("should set the path dynamically based on region", () => {
    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: "Americas" } });
    expect(mockSetRegionPath).toHaveBeenCalledWith("/region/Americas");

    fireEvent.change(select, { target: { value: "Oceania" } });
    expect(mockSetRegionPath).toHaveBeenCalledWith("/region/Oceania");
  });

  it("should not call setRegionPath if default value is selected", () => {
    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: "" } });
    expect(mockSetRegionPath).toHaveBeenCalledWith("");
  });
});

describe("CountryCard Component", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  const country: Country = {
    name: "France",
    code: "FR",
    flag: "https://flagcdn.com/fr.svg",
    region: "Europe",
    timezone: "UTC+01:00",
  };

  it("should render the country card with flag, name, and region", () => {
    render(<CountryCard country={country} />);

    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", country.flag);
    expect(image).toHaveAttribute("alt", country.name);

    expect(screen.getByText(country.name)).toBeInTheDocument();

    expect(screen.getByText(`🌍 ${country.region}`)).toBeInTheDocument();
  });

  it("should navigate to the country details page when 'View Details' is clicked", () => {
    render(<CountryCard country={country} />);

    const button = screen.getByText("View Details");
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith(`/countries/${country.code}`);
  });

  it("should display the correct time based on timezone", async () => {
    vi.useFakeTimers();
    render(<CountryCard country={country} />);

    const timeElement = screen.getByText(/Current Time:/);

    vi.setSystemTime(new Date("2025-03-08T11:00:00Z"));
    vi.advanceTimersByTime(1000);

    expect(timeElement.innerHTML).toContain("⏰ Current Time: --");
    vi.useRealTimers();
  });

  it("should update the time every second", () => {
    vi.useFakeTimers();
    render(<CountryCard country={country} />);

    const timeElement = screen.getByText(/Current Time:/);

    vi.setSystemTime(new Date("2025-03-08T11:00:00Z"));
    vi.advanceTimersByTime(1000);

    expect(timeElement.innerHTML).toContain("⏰ Current Time: --");

    vi.advanceTimersByTime(60000);

    expect(timeElement.innerHTML).toContain("⏰ Current Time: --");
    vi.useRealTimers();
  });

  it("should not update the time if timezone is missing", () => {
    const noTimezoneCountry = {
      ...country,
      timezone: "",
    };

    render(<CountryCard country={noTimezoneCountry} />);

    const timeElement = screen.getByText(/Current Time:/);
    expect(timeElement.innerHTML).toContain("--");
  });

  it("should scale the card when hovered", () => {
    render(<CountryCard country={country} />);

    const card = screen.getByText(country.name).closest("div");
    expect(card).toHaveClass("p-4 text-center");
  });

  it("should have a button labeled 'View Details'", () => {
    render(<CountryCard country={country} />);

    const button = screen.getByText("View Details");
    expect(button).toBeInTheDocument();
  });
});
