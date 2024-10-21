import {v7 as generateUuid} from "uuid";

export class User {
    id: string;
    username: string;
    age: number;
    hobbies: string[];

    constructor() {
        this.id = generateUuid();
    }
}