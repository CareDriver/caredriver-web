import { nanoid } from "nanoid";

export function genDocId(): string {
    return nanoid(30);
}

export function genFakeId(): string {
    return nanoid(30);
}
