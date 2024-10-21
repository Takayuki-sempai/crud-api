import * as http from "node:http";
import {IncomingMessage, ServerResponse} from "http";
import {ensureExists} from "../util/utils.js";
import {HttpResponseCode, PostHandler, UrlHandler} from "./types.js";
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

const handleServerError = (response: ServerResponse, message?: string) => {
    response.statusCode = HttpResponseCode.INTERNAL_SERVER_ERROR
    response.end(message || "Internal Server Error")
}

const handleBadRequestError = (response: ServerResponse, message?: string) => {
    response.statusCode = HttpResponseCode.BAD_REQUEST
    response.end(message || "User Server Error")
}

const handleNotFoundError = (response: ServerResponse, message?: string) => {
    response.statusCode = HttpResponseCode.NOT_FOUND
    response.end(message || "404 Not Found")
}

export const Server = () => {
    const methodRoutes = {
        "GET": [] as Route[],
        "POST": [] as Route[],
    };
    const server = http.createServer(async (request: IncomingMessage, response: ServerResponse) => {
        request.on('error', () => {
            handleServerError(response);
        })
        try {
            const method = ensureExists(request.method, () => `Can't handle request without method url: ${request.url}`)
            const routes = ensureExists(
                methodRoutes[method.toUpperCase() as keyof typeof methodRoutes],
                () => `Can't handle request with method ${request.method}, url: ${request.url}`
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
            response.end()
        } catch (e: any) {
            const message = e instanceof Error ? e.message : 'Unknown Error'
            message && console.log(message)
            if (e instanceof NotFoundError) {
                handleNotFoundError(response, message)
            } else if(e instanceof RequestParseError) {
                handleBadRequestError(response, message)
            } else {
                handleServerError(response, message)
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

    const get = (url: string, handler: UrlHandler) => {
        methodRoutes["GET"].push(prepareRoute(url, handler))
    }
    const post = (url: string, handler: PostHandler) => {
        const handlerWithBody = async (params: Map<string, string>, request: IncomingMessage, response: ServerResponse) =>
            handler(await getBody(request), params, request, response)
        methodRoutes["POST"].push(prepareRoute(url, handlerWithBody))
    }

    const listen = (port: number, handler: () => void) => {
        server.listen(port, handler)
    }

    return {get, post, listen}
}