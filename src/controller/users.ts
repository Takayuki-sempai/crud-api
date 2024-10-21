import {HandlerResponse, HttpResponseCode, PostHandler, UrlHandler} from "../server/types.js";
import {toUserMode} from "../model/users.js";
import {InternalError, NotFoundError, RequestParseError} from "../error/errors.js";
import {createOkResponse, createResponse} from "../server/response.js";
import {validate} from "uuid";
import {UserDatabase} from "../database/types.js";

export const UsersController = (db: UserDatabase) => {
    const getAllUsers: UrlHandler = async (_: Map<string, string>): Promise<HandlerResponse> => {
        const users = db.getAllUsers()
        return createOkResponse(users)
    }

    const getUserById: UrlHandler = async (params: Map<string, string>): Promise<HandlerResponse> => {
        const userId = params.get("userId")
        if (!userId) {
            throw new InternalError("Param userId not found")
        }
        if (!validate(userId)) {
            throw new RequestParseError("UserId id not uuid type")
        }
        const foundUser = db.findUser(userId)
        if (!foundUser) {
            throw new NotFoundError(`User with id: ${userId} not found`)
        }
        return createOkResponse(foundUser)
    }

    const addUser: PostHandler = async (body: object): Promise<HandlerResponse> => {
        const newUser = toUserMode(body)
        db.addUser(newUser)
        return createResponse(newUser, HttpResponseCode.CREATED)
    }

    return {
        getAllUsers,
        getUserById,
        addUser,
    }
}