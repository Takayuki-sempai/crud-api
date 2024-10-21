import {Server} from "./src/server/server.ts";
import {ensureNumber} from "./src/util/utils.js";
import {UsersController} from "./src/controller/users.js";

const server = Server()
const controller = UsersController()
const port = ensureNumber(process.env.PORT) || 3000;

server.get("/api/users", controller.getAllUsers)
server.get("/api/users/{userId}", controller.getUserById)
server.post("/api/users", controller.addUser)

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});