import {HandlerResponse, HttpResponseCode, PostHandler, UrlHandler} from "../server/types.js";
import {toUserMode} from "../model/users.js";
import {User} from "../model/types.js";
import {InternalError, NotFoundError} from "../error/errors.js";
import {createOkResponse, createResponse} from "../server/response.js";

const users: User[] = []

export const getAllUsers: UrlHandler = async (_: Map<string, string>): Promise<HandlerResponse> => {
   return createOkResponse(users)
}

export const getUserById: UrlHandler = async (params: Map<string, string>): Promise<HandlerResponse> => {
    const userId = params.get("userId")
    if(!userId) {
        throw new InternalError("Param userId not found")
    }
    const foundUser = users.find(user => user.id === userId)
    if(!foundUser) {
        throw new NotFoundError(`User with id: ${userId} not found`)
    }
    return createOkResponse(foundUser)
}

export const addUser: PostHandler = async (body: object): Promise<HandlerResponse> => {
    const newUser = toUserMode(body)
    users.push(newUser)
    return createResponse(newUser, HttpResponseCode.CREATED)
}