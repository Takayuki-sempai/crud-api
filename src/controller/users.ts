import {
  HandlerResponse,
  HttpResponseCode,
  UrlBodyHandler,
  UrlHandler,
} from '../server/types.js';
import { toUserModel } from '../model/users.js';
import {
  InternalError,
  NotFoundError,
  RequestParseError,
} from '../error/errors.js';
import { createOkResponse, createResponse } from '../server/response.js';
import { validate } from 'uuid';
import { UserDatabase } from '../database/types.js';

export const UsersController = (db: UserDatabase) => {
  const ensureUserId = (params: Map<string, string>): string => {
    const userId = params.get('userId');
    if (!userId) {
      throw new InternalError('Param userId not found');
    }
    if (!validate(userId)) {
      throw new RequestParseError('UserId id not uuid type');
    }
    return userId;
  };

  const getAllUsers: UrlHandler = async (
    _: Map<string, string>,
  ): Promise<HandlerResponse> => {
    const users = db.getAllUsers();
    return createOkResponse(users);
  };

  const getUserById: UrlHandler = async (
    params: Map<string, string>,
  ): Promise<HandlerResponse> => {
    const userId = ensureUserId(params);
    const foundUser = db.findUser(userId);
    if (!foundUser) {
      throw new NotFoundError(`User with id: ${userId} not found`);
    }
    return createOkResponse(foundUser);
  };

  const addUser: UrlBodyHandler = async (
    body: object,
  ): Promise<HandlerResponse> => {
    const newUser = toUserModel(body);
    db.saveUser(newUser);
    return createResponse(newUser, HttpResponseCode.CREATED);
  };

  const changeUser: UrlBodyHandler = async (
    body: object,
    params: Map<string, string>,
  ): Promise<HandlerResponse> => {
    const userId = ensureUserId(params);
    const newUser = toUserModel(body, userId);
    const oldUser = db.findUser(userId);
    if (!oldUser) {
      throw new NotFoundError(`User with id: ${userId} not found`);
    }
    db.saveUser(newUser);
    return createResponse(newUser, HttpResponseCode.CREATED);
  };

  const removeUser: UrlHandler = async (
    params: Map<string, string>,
  ): Promise<HandlerResponse> => {
    const userId = ensureUserId(params);
    const isRemoved = db.removeUser(userId);
    if (!isRemoved) {
      throw new NotFoundError(`User with id: ${userId} not found`);
    }
    return createResponse(
      { message: 'User successfully deleted' },
      HttpResponseCode.NO_CONTENT,
    );
  };

  return {
    getAllUsers,
    getUserById,
    addUser,
    changeUser,
    removeUser,
  };
};
