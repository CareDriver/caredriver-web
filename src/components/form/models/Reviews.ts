export interface ReviewState {
  loading: boolean;
  reviewed: boolean;
}

export const DEFAULT_REVIEW_STATE: ReviewState = {
  loading: false,
  reviewed: false,
};
