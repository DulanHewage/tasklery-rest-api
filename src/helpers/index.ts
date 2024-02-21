// validation error types
import { fieldError } from "../types/validations.js";

export function mapFieldValidationErrors(error: any): fieldError[] | false {
  const fieldErrors: fieldError[] = [];
  for (const key in error.errors) {
    if (Object.prototype.hasOwnProperty.call(error.errors, key)) {
      const errorObj = error.errors[key];
      fieldErrors.push({
        field: key,
        message: errorObj.message,
      });
    }
  }

  if (error.name && error.name !== "ValidationError") {
    fieldErrors.push({
      field: error.name,
      message: error?.message,
    });
  }

  if (!fieldErrors.length) {
    return false;
  }
  return fieldErrors;
}
