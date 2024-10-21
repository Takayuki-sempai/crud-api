import * as http from "node:http";
import {IncomingMessage, ServerResponse} from "http";
import {ensureExists} from "../util/utils.js";
import {HttpResponseCode, UrlBodyHandler, UrlHandler} from "./types.js";
import {NotFoundError, RequestParseError} from "../error/errors.js";

type Route = {
    testUrl: RegExp,
    params: string[],
    handler: UrlHandler,
}

const getBody = (request: IncomingMessage): Promise<object> => {
    return new Promise((resolve) => {
        const bodyParts: Uint8Array[] = [];
        let body;
        request.on('data', (chunk) => {
            bodyParts.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(bodyParts).toString();
            resolve(body ? JSON.parse(body) : {});
        });
    });
}

const handleError = (response: ServerResponse, message: string, statusCode: HttpResponseCode) => {
    response.statusCode = statusCode
    response.setHeader("Content-Type", "application/json")
    response.end(JSON.stringify({message}))
}

export const Server = () => {
    const methodRoutes = {
        GET: [] as Route[],
        POST: [] as Route[],
        PUT: [] as Route[],
        DELETE: [] as Route[],
    };
    const server = http.createServer(async (request: IncomingMessage, response: ServerResponse) => {
        request.on('error', () => {
            handleError(response, "Internal Server Error", HttpResponseCode.INTERNAL_SERVER_ERROR)
        })
        try {
            const method = ensureExists(request.method, () => `Can't handle request without method url: ${request.url}`)
            const routes = ensureExists(
                methodRoutes[method.toUpperCase() as keyof typeof methodRoutes],
                () => `Server couldn't process method: ${request.method}, url: ${request.url}`
            )
            const url = ensureExists(request.url, () => `url not found in request ${request}`)
            const route = ensureExists(
                routes.find(route => url.match(route.testUrl)),
                () => `Handler not found for url ${url}`
            )
            const execResult = route.testUrl.exec(url)
            const resultParams = new Map();
            if (execResult) {
                route.params.forEach((paramName, index) => {
                    resultParams.set(paramName, execResult[index + 1])
                })
            }
            const result = await route.handler(resultParams, request, response)
            response.statusCode = result.code || HttpResponseCode.OK
            response.setHeader("Content-Type", "application/json")
            response.end(JSON.stringify(result.body))
        } catch (e: any) {
            const message = e instanceof Error ? e.message : 'Unknown Error'
            message && console.log(message)
            if (e instanceof NotFoundError) {
                handleError(response, message || "404 Not Found", HttpResponseCode.NOT_FOUND)
            } else if (e instanceof RequestParseError) {
                handleError(response, message || "Bad request", HttpResponseCode.BAD_REQUEST)
            } else {
                handleError(response, message || "Internal Server Error", HttpResponseCode.INTERNAL_SERVER_ERROR)
            }
        }
    })

    const prepareRoute = (url: string, handler: UrlHandler): Route => {
        const regexp = new RegExp("({[^{}]*})", "g")
        const urlParams = url.match(regexp)
        const params = urlParams?.map(param => param.slice(1, -1)) || []
        const testUrl = new RegExp("^" + url.replaceAll("/", "\\/").replaceAll(regexp, "([^\\/]*)") + "$", "g")
        return {testUrl, params, handler}
    }

    const createFromBodyHandler = (handler: UrlBodyHandler): UrlHandler =>
        async (params: Map<string, string>, request: IncomingMessage, response: ServerResponse) =>
            handler(await getBody(request), params, request, response)

    const get = (url: string, handler: UrlHandler) => {
        methodRoutes["GET"].push(prepareRoute(url, handler))
    }
    const post = (url: string, handler: UrlBodyHandler) => {
        methodRoutes["POST"].push(prepareRoute(url, createFromBodyHandler(handler)))
    }
    const put = (url: string, handler: UrlBodyHandler) => {
        methodRoutes["PUT"].push(prepareRoute(url, createFromBodyHandler(handler)))
    }
    const del = (url: string, handler: UrlHandler) => {
        methodRoutes["DELETE"].push(prepareRoute(url, handler))
    }

    const listen = (port: number, handler: () => void) => {
        server.listen(port, handler)
    }

    return {get, post, put, del, listen}
}