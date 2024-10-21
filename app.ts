import {Server} from "./src/server.ts";
import {ensureNumber} from "./src/util/utils.js";

const server = Server()
const port = ensureNumber(process.env.PORT) || 3000;

server.get("/test/{par}", (req, res, params) => {
    console.log(req, res, params)}
)
server.get("/test/{par}/{par2}", (req, res, params) => {
    console.log(req, res, params)}
)

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});