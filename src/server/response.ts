import { HandlerResponse, HttpResponseCode } from './types.js';

export const createResponse = (
  response: object,
  code: HttpResponseCode,
): HandlerResponse => ({
  body: response,
  code: code,
});

export const createOkResponse = (response: object): HandlerResponse =>
  createResponse(response, HttpResponseCode.OK);
