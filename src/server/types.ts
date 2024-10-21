import {IncomingMessage, ServerResponse} from "http";

export enum HttpResponseCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

export type HandlerResponse = {
    body: object;
    code?: HttpResponseCode;
}

export type UrlHandler = (params: Map<string, string>, request: IncomingMessage, response: ServerResponse) => Promise<HandlerResponse>;
export type PostHandler = (body: object, params: Map<string, string>, request: IncomingMessage, response: ServerResponse) => Promise<HandlerResponse>;