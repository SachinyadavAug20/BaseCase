import { intershipFilterParams } from "@/types/action";

// get location using ip
export const fetchLocation = async () => {
  const response = await fetch("http://ip-api.com/json/?fields=country");
  const location = await response.json();
  return location.country;
};

export const fetchCountries = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const fetchIntership = async (filters: intershipFilterParams) => {
  const { query, page } = filters;
  
  const headers = {
    "X-RapidAPI-Key": process.env.NEXT_PUBLIC_INTERSHIP_RAPID_API_KEY || "",
    "X-RapidAPI-Host": "internships-api.p.rapidapi.com",
    'Content-Type': 'application/json'
  };

  try {
    // 1. Corrected the URL structure based on the official endpoint
    const response = await fetch(
      `https://internships-api.p.rapidapi.com/active-jb-7d?query=${encodeURIComponent(query)}&page=${page}`,
      {
        method: 'GET',
        headers,
      },
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    // 2. Return the full result first to see its shape, 
    // or safely fallback if 'data' doesn't exist.
    return result.data || result; 
    
  } catch (error) {
    console.error("Failed to fetch internships:", error);
    return null; // Return null instead of crashing or returning undefined
  }
};
