import {User} from "./types.js";
import {RequestParseError} from "../error/errors.js";

enum FieldType {
    STRING = 'string',
    NUMBER = 'number',
    ARRAY = 'array'
}

type FieldInfo = {
    type: FieldType,
    innerType?: FieldType.STRING
}

const userRequiredFields = {
    username: {
        type: FieldType.STRING
    } as FieldInfo,
    age: {
        type: FieldType.NUMBER
    } as FieldInfo,
    hobbies: {
        type: FieldType.ARRAY,
        innerType: FieldType.STRING
    } as FieldInfo
}

const checkField = (obj: object, fieldName: string, fieldInfo: FieldInfo) => {
    const field: any = obj[fieldName as keyof typeof obj];
    if (field === undefined) {
        throw new RequestParseError(`Missing required field key: ${fieldName}`);
    }
    if (fieldInfo.type !== FieldType.ARRAY) {
        if (typeof field !== fieldInfo.type) {
            throw new RequestParseError(`Field ${fieldName} has incorrect type: ${typeof field}\nCorrect type: ${fieldInfo.type}`);
        }
    } else {
        if (!(field instanceof Array)) throw new RequestParseError(`Field ${fieldName} has incorrect type: ${typeof field}\nCorrect type: Array`);
        (field as object[]).forEach(element => {
            if (typeof element !== fieldInfo.innerType) {
                throw new RequestParseError(`Element in field ${fieldName} has incorrect type: ${typeof element}\nCorrect type: ${fieldInfo.innerType}`);
            }
        })
    }
}

export const toUserModel = (request: object, userId?: string): User => {
    const user: User = new User(userId)
    Object.entries(userRequiredFields).forEach(([fieldName, fieldInfo]) => {
        checkField(request, fieldName, fieldInfo);
        user[fieldName as keyof typeof user] = request[fieldName as keyof typeof request];
    })
    return user;
}