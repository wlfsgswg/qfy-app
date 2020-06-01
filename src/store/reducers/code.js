const code = (state = {}, action) => {
  switch (action.type) {
    case "ADD-CODE":
      return { ...action.data };
    default:
      return state;
  }
};

export default code;
