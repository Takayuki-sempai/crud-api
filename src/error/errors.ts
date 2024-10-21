export class ValueNotExistsError extends Error{
    constructor(msg?: string){
        super(msg);
    }
}

export class RequestParseError extends Error{
    constructor(msg?: string){
        super(msg);
    }
}