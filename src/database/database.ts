import {User} from "../model/types.js";

export const UsersDatabase = () => {
    const users: Map<string, User> = new Map()

    const getAllUsers = (): User[] => {
        return [...users].map(([_, value]) => value);
    }

    const findUser = (userId: string): User | undefined => {
        return users.get(userId)
    }

    const saveUser = (user: User) => {
        users.set(user.id, user)
    }

    return {
        getAllUsers,
        findUser,
        saveUser
    }
}