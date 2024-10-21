import * as http from "node:http";
import {IncomingMessage, ServerResponse} from "http";
import {ensureExists} from "./util/utils.js";

type UrlHandler = (request: IncomingMessage, response: ServerResponse, params: Map<string, string>) => Promise<void>
type PostHandler = (request: IncomingMessage, response: ServerResponse, params: Map<string, string>, body: string) => Promise<void>

type Route = {
    testUrl: RegExp,
    params: string[],
    handler: UrlHandler,
}

const Server = () => {
    const methodRoutes = {
        "GET": [] as Route[],
        "POST": [] as Route[],
    };
    const server = http.createServer(async (request: IncomingMessage, response: ServerResponse) => {
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
            route.handler(request, response, resultParams)
            response.end()
        } catch (e: any) {
            const message = e instanceof Error ? e.message : 'Unknown Error'
            message && console.log(message)
            response.statusCode = 404;
            response.end()
        }
    })

    const getBody = (request: IncomingMessage): Promise<string> => {
        return new Promise((resolve) => {
            const bodyParts: Uint8Array[] = [];
            let body;
            request.on('data', (chunk) => {
                bodyParts.push(chunk);
            }).on('end', () => {
                body = Buffer.concat(bodyParts).toString();
                resolve(body)
            });
        });
    }

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
        const handlerWithBody = async (request: IncomingMessage, response: ServerResponse, params: Map<string, string>) =>
            handler(request, response, params, await getBody(request))
        methodRoutes["POST"].push(prepareRoute(url, handlerWithBody))
    }

    const listen = (port: number, handler: () => void) => {
        server.listen(port, handler)
    }

    return {get, post, listen}
}

export {Server}