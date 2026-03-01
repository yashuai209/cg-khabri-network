// src/lib/api.ts

export const API_BASE = "/api";

export const getApiUrl = (endpoint: string) => {
  return `${API_BASE}/${endpoint}`;
};

export const fetchApi = async (
  endpoint: string,
  options: RequestInit = {}
) => {

  const url = getApiUrl(endpoint);

  try {

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    return response;

  } catch (error) {

    console.error("API connection error:", error);
    throw error;

  }

};