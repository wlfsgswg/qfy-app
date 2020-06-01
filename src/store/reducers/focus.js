const focus = (state = 1, action) => {
  switch (action.type) {
    case "CHANGE-FOCUS":
      return action.focus;
    default:
      return state;
  }
};

export default focus;
