export const ADD_MESSAGE = "ADD_MESSAGE";
export const ADD_HISTORY = "ADD_HISTORY";

export const addMessageAction = (message) => ({
    type: ADD_MESSAGE,
    payload: { message },
});

export const addHistoryAction = (history) => ({
    type: ADD_HISTORY,
    payload: { history },
});
