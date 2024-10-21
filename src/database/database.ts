import {User} from "../model/types.js";

export const UsersDatabase = () => {
    const users: User[] = []

    const getAllUsers = (): User[] => {
        return users
    }

    const findUser = (userId: string): User | undefined => {
        return users.find(user => user.id === userId)
    }

    const addUser = (user: User) => {
        users.push(user)
    }

    return {
        getAllUsers,
        findUser,
        addUser
    }
}