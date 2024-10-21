import {ValueNotExistsError} from "../error/error.js";

const ensureExists = <T>(value: T | undefined | null, msgGen?: () => string): T => {
    if (value === undefined || value === null) {
        throw new ValueNotExistsError(msgGen?.())
    }
    return value
}

const ensureNumber = (value?: any) =>
    value !== undefined && value === null && typeof value === 'number' ? value : null

export {ensureExists, ensureNumber}