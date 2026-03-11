export interface RefAttachment {
  ref: string;
  url: string;
}

export const EMPTY_REF_ATTACHMENT: RefAttachment = {
  ref: "",
  url: "",
};

export const DELETED_REF_ATTACHMENT = {
  ref: "deleted",
  url: "",
};
