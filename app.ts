import {Server} from "./src/server/server.ts";
import {ensureNumber} from "./src/util/utils.js";
import {getAllUsers} from "./src/controller/users.js";
import {HandlerResponse} from "./src/server/types.js";

const server = Server()
const port = ensureNumber(process.env.PORT) || 3000;

server.get("/api/users", getAllUsers)
server.get("/test/{par}/{par2}", async (req, res, params): HandlerResponse => {
    console.log(req, res, params)
})

server.post("/test", async (req, res, params, body: object) => {
    console.log(req, res, params, body)}
)

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});