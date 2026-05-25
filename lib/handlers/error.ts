import { NextResponse } from "next/server";
import { RequestError, ValidationError } from "../http-error";
import { ZodError } from "zod";
import logger from "../logger";

export type ResponseType = "api" | "server"; // handling 2 types of error api or server action

const formatResponse = (
  responseType: ResponseType,
  status: number,
  message: string,
  errors?: Record<string, string[]> | string | undefined,
) => {
  const responseContent = {
    success: false,
    error: {
      message: message,
      details: errors,
    },
  };

  return responseType === "api"
    ? NextResponse.json(responseContent, { status })
    : { status: status, ...responseContent };
};

const handleError = (error: unknown, responseType: ResponseType = "server") => {
  if (error instanceof RequestError) {
    logger.error({err:error},`${responseType.toUpperCase()} Error : ${error.message}`)
    return formatResponse(
      responseType,
      error.statusCode,
      error.message,
      error.errors,
    );
  }
  if (error instanceof ZodError) {
    const validationErrors = new ValidationError(
      error.flatten().fieldErrors as Record<string, string[]>,
    ); // flatteb convert array of arrau into single array
    logger.error({err:error},`validationError:${validationErrors.message}`)
    return formatResponse(
      responseType,
      validationErrors.statusCode,
      validationErrors.message,
      validationErrors.errors,
    );
  }
  if (error instanceof Error) {
    logger.error(error.message)
    return formatResponse(responseType, 500, error.message); // general
  }
  logger.error({err:error},'An unexpected error occured')
  return formatResponse(responseType, 500, "Unexpected error occured");
};

export default handleError;
