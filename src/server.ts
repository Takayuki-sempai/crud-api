import * as http from "node:http";
import {IncomingMessage, ServerResponse} from "http";
import {ensureExists} from "./util/utils.js";

type UrlHandler = (request: IncomingMessage, response: ServerResponse, params: Map<string, string>) => void

type Route = {
    testUrl: RegExp,
    params: string[],
    handler: UrlHandler,
}

const Server = () => {
    const methodRoutes = {
        "GET": [] as Route[],
    };
    const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
        try {
            const method = ensureExists(req.method, () => `Can't handle request without method url: ${req.url}`)
            const routes = ensureExists(
                methodRoutes[method.toUpperCase() as keyof typeof methodRoutes],
                () => `Can't handle request with method ${req.method}, url: ${req.url}`
            )
            const url = ensureExists(req.url, () => `url not found in request ${req}`)
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
            route.handler(req, res, resultParams)
            res.end()
        } catch (e: any) {
            const message = e instanceof Error ? e.message : 'Unknown Error'
            message && console.log(message)
            res.statusCode = 404;
            res.end()
        }
    })

    const get = (url: string, handler: UrlHandler) => {
        const regexp = new RegExp("({[^{}]*})", "g")
        const urlParams = url.match(regexp)
        const params = urlParams?.map(param => param.slice(1, -1)) || []
        const testUrl = new RegExp("^" + url.replaceAll("/", "\\/").replaceAll(regexp, "([^\\/]*)") + "$", "g")
        methodRoutes["GET"].push({testUrl, params, handler})
    }

    const listen = (port: number, handler: () => void) => {
        server.listen(port, handler)
    }

    return {get, listen}
}

export {Server}