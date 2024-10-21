class ValueNotExistsError extends Error{
    constructor(msg?: string){
        super(msg);
    }
}

export {ValueNotExistsError}