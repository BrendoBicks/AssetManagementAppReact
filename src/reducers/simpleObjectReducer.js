export const simpleObjectReducer = (state, action) => {
  switch (action.type) {
    case "update":
      return {
        ...state,
        [action.key]: action.value,
      };
    case "bulkUpdate":
      return {
        ...state,
        ...action.payload,
      };
    case "set":
      return action.payload;
    case "reset":
      return null;
    default:
      return state;
  }
};
