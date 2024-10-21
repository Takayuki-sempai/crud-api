import {IncomingMessage, ServerResponse} from "http";
import {HandlerResponse, PostHandler, UrlHandler} from "../server/types.js";
import {toUserMode} from "../model/users.js";
import {User} from "../model/types.js";

const users: User[] = []

export const getAllUsers: UrlHandler = async (_request: IncomingMessage, _response: ServerResponse, _params: Map<string, string>): HandlerResponse => {
   return users
}

export const addUser: PostHandler = async (_request: IncomingMessage, _response: ServerResponse, _params: Map<string, string>, body: object): HandlerResponse => {
    const newUser = toUserMode(body)
    users.push(newUser)
    return newUser
}