import {Server} from "./src/server/server.ts";
import {ensureNumber} from "./src/util/utils.js";
import {addUser, getAllUsers, getUserById} from "./src/controller/users.js";

const server = Server()
const port = ensureNumber(process.env.PORT) || 3000;

server.get("/api/users", getAllUsers)
server.get("/api/users/{userId}", getUserById)
server.post("/api/users", addUser)

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});