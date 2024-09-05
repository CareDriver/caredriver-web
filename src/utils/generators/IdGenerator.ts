import { nanoid } from "nanoid";

const MIN_LENGTH_DOC_ID = 30;

export const NO_FAKE_ID_SAVED = "nosaved";

export function genDocId(): string {
    return nanoid(MIN_LENGTH_DOC_ID);
}

export function genFakeId(): string {
    return nanoid(MIN_LENGTH_DOC_ID);
}

export function getFakeIdSaved(fakeIdSaved: string | undefined): string {
    if (!fakeIdSaved) {
        return NO_FAKE_ID_SAVED;
    }

    return fakeIdSaved;
}
