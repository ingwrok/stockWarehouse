import { z } from "zod";
import { generateErrorMessage, ErrorMessageOptions } from 'zod-error';

import { isFormdataFromBodyParser, convertFormdataToObject } from "../index";

export const name = "Zod";

export const indentityCheck = (schema) => {
  return schema instanceof z.ZodType;
}

export const validation = (schema) => {
  return (data) => {
    const isFormdata = isFormdataFromBodyParser(data);
    const rawData = isFormdata ? convertFormdataToObject(data) : data;
    const zodParsedPayload = (<z.Schema>schema).safeParse(rawData, {});

    if (zodParsedPayload.success) {
      return { 
        value: zodParsedPayload.data
      };
    };

    const options: ErrorMessageOptions = {
      delimiter: {
        error: ' | ',
        component: ' ',
      },
      path: {
        enabled: true,
        type: "objectNotation",
        transform: ({ label, value }) => `( ${value} )`,
      },
      transform: ({ errorMessage, index }) => `${errorMessage}`,
    };
    const errorMessage = generateErrorMessage(zodParsedPayload.error.issues, options);
    return {
      error: new Error(errorMessage)
    }
  };
}

export default {
  name: name,
  indentityCheck: indentityCheck,
  validation: validation
}