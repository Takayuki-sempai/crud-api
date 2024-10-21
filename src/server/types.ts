import {IncomingMessage, ServerResponse} from "http";

export type HandlerResponse = Promise<object | void>;
export type UrlHandler = (request: IncomingMessage, response: ServerResponse, params: Map<string, string>) => HandlerResponse;
export type PostHandler = (request: IncomingMessage, response: ServerResponse, params: Map<string, string>, body: object) => HandlerResponse;