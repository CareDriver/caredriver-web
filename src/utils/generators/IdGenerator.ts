import { nanoid } from "nanoid";

const MIN_LENGTH_DOC_ID = 30;

export function genDocId(): string {
    return nanoid(MIN_LENGTH_DOC_ID);
}

export function genFakeId(): string {
    return nanoid(MIN_LENGTH_DOC_ID);
}
