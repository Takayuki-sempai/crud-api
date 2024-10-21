import {IncomingMessage, ServerResponse} from "http";
import {HandlerResponse, PostHandler, UrlHandler} from "../server/types.js";
import {toUserMode} from "../model/users.js";
import {User} from "../model/types.js";
import {InternalError, NotFoundError} from "../error/errors.js";

const users: User[] = []

export const getAllUsers: UrlHandler = async (_request: IncomingMessage, _response: ServerResponse, _params: Map<string, string>): HandlerResponse => {
   return users
}

export const getUserById: UrlHandler = async (_request: IncomingMessage, _response: ServerResponse, params: Map<string, string>): HandlerResponse => {
    const userId = params.get("userId")
    if(!userId) {
        throw new InternalError("Param userId not found")
    }
    const foundUser = users.find(user => user.id === userId)
    if(!foundUser) {
        throw new NotFoundError(`User with id: ${userId} not found`)
    }
    return foundUser
}

export const addUser: PostHandler = async (_request: IncomingMessage, response: ServerResponse, _params: Map<string, string>, body: object): HandlerResponse => {
    const newUser = toUserMode(body)
    users.push(newUser)
    response.statusCode = 201
    return newUser
}