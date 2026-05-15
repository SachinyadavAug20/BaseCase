// centralized handler
import { ActionResponse } from "@/types/global";
import logger from "../logger";
import handleError from "./error";
import { RequestError } from "../http-error";

interface FetchOption extends RequestInit {
  timeout?: number;
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export async function fetchHandler<T>( url: string, options: FetchOption = {},): Promise<ActionResponse<T>> {
  const {
    timeout = 100000,
    headers: customHeaders = {},
    ...restoptions
  } = options;
  const controller = new AbortController(); // abort request
  const id = setTimeout(() => controller.abort(), timeout);
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "Application/json",
  };
  const headers: HeadersInit = { ...defaultHeaders, ...customHeaders };
  const config = {
    ...restoptions,
    headers,
    signal: controller.signal,
  };
  try {
    const response = await fetch(url, config);
    clearTimeout(id);
    if (!response.ok) {
      throw new RequestError(
        `HTTP error! status: ${response.status}`,
        response.status,
      );
    }
    return await response.json();
  } catch (err) {
    const error = isError(err) ? err : new Error("Unknow error");
    if (error.name === "AbortError") {
      logger.warn(`Request timeout ${url}`);
    } else {
      logger.error(`Error fetching ${url}: ${error.message}`);
    }
    return handleError(error) as ActionResponse<T>;
  }
}
