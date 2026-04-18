export type ActionState = {
  error: string | null;
  success: boolean;
};

export const INITIAL_ACTION_STATE: ActionState = {
  error: null,
  success: false
};
