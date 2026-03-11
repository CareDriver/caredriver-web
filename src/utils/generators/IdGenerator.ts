import { nanoid } from "nanoid";

const MIN_LENGTH_DOC_ID = 30;

export const NO_ID_SAVED = "nosaved";

export function genDocId(): string {
  return nanoid(MIN_LENGTH_DOC_ID);
}

export function genFakeId(): string {
  return nanoid(MIN_LENGTH_DOC_ID);
}

export function getIdSaved(idSaved: string | undefined): string {
  if (!idSaved) {
    return NO_ID_SAVED;
  }

  return idSaved;
}
