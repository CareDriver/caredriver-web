export interface PersonalData {
    fullname: string | undefined;
    photo: string | undefined | null;
}

export interface PhotoField {
    value: string | null;
    message: string | null;
}

export const defaultPhoto: PhotoField = {
    value: null,
    message: null,
};
