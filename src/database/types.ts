import {User} from "../model/types.js";

export type UserDatabase = {
    getAllUsers: () => User[],
    findUser: (userId: string) => User | undefined,
    addUser: (user: User) => void
}