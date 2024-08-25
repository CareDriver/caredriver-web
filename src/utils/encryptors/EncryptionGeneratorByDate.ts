import { doesCookieMatch, setCookieToExpireAtEndOfDay } from "../storage_handlers/CookieStoragerer";
import { encrypt } from "./Encryptor";

const getIdEncrypt = (id: string) => {
    const today = new Date();
    return encrypt(
        id + 
        today.getFullYear() + 
        today.getMonth() + 
        today.getDay()
    );
};

export const setVisitedToday = (target: string, id: string) => {
    setCookieToExpireAtEndOfDay(target + id, getIdEncrypt(id));
};

export const wasAlreadyVisited = (target: string, id: string): boolean => {
    return doesCookieMatch(target + id, getIdEncrypt(id));
};
