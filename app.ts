import {Server} from "./src/server.ts";
import {ensureNumber} from "./src/util/utils.js";

const server = Server()
const port = ensureNumber(process.env.PORT) || 3000;

server.get("/test/{par}", async (req, res, params) => {
    console.log(req, res, params)}
)
server.get("/test/{par}/{par2}", async (req, res, params) => {
    console.log(req, res, params)}
)

server.post("/test", async (req, res, params, body: string) => {
    console.log(req, res, params, body)}
)

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});