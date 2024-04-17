// dependencies

import { StatusConsole } from './logging.js';
const console = new StatusConsole('responder.js');


// system

const responseCases = [
  {
    "code": 200,
    "status": "success",
    "message": "Request completed successfully."
  },
  {
    "code": 201,
    "status": "success",
    "message": "Resource created successfully."
  },
  {
    "code": 400,
    "status": "error",
    "message": "The request could not be understood due to malformed syntax."
  },
  {
    "code": 401,
    "status": "error",
    "message": "Authentication is required and has failed or has not yet been provided."
  },
  {
    "code": 403,
    "status": "error",
    "message": "The server understood the request, but is refusing to fulfill it."
  },
  {
    "code": 404,
    "status": "error",
    "message": "The requested resource was not found."
  },
  {
    "code": 429,
    "status": "error",
    "message": "Too many requests have been sent in a given amount of time."
  },
  {
    "code": 500,
    "status": "error",
    "message": "An unexpected condition was encountered on the server."
  },
  {
    "code": 503,
    "status": "error",
    "message": "The server is currently unable to handle the request due to maintenance downtime or capacity problems."
  }
];


// exports

export default function responder(res, code, data = {}, message = "") {
  let response = responseCases.find(c => c.code === code);

  // create the base response utilizing the found case
  // or a generic response if the case is not found
  let baseResponse = response ? {
    status: response.status,
    code: response.code,
    message: message || response.message, // Use the provided message, or the default if not provided
  } : {
    status: 'error',
    code: 500,
    message: 'An unexpected error occurred.',
  };

  // Add data to the response if present
  if (Object.keys(data).length) {
    baseResponse.data = data;
  }

  res.status(baseResponse.code).json(baseResponse);
}
