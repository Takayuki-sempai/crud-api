import {IncomingMessage, ServerResponse} from "http";
import {v7 as generateUuid} from "uuid";
import {HandlerResponse, UrlHandler} from "../server/types.js";

type User = {
    id: string,
    username: string,
    age: number,
    hobbies: string[]
}

const users: User[] = [
    {
        id: generateUuid(),
        username: "Anton",
        age: 14,
        hobbies: []
    },
    {
        id: generateUuid(),
        username: "Vlad",
        age: 25,
        hobbies: []
    },
]

export const getAllUsers: UrlHandler = async (_request: IncomingMessage, _response: ServerResponse, _params: Map<string, string>): HandlerResponse => {
   return users
}