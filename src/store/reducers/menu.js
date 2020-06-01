const array = [{ title: "工作台", link: "/work", focus: 1 }];
const menu = (state = array, action) => {
  switch (action.type) {
    case "ADD-MENU":
      let bol = true;
      state.map((item) => {
        bol = bol && item.title !== action.data.title;
        return undefined;
      });
      return bol ? [...state, action.data] : state;
    case "DELETE-MENU":
      state.map((item, i) => {
        if (item.focus === action.data.focus) state.splice(i, 1);
        return undefined;
      });
      return [...state];

    case "CHANGE-MENU":
      state.map((item) => {
        if (item.focus === action.data.focus) item.link = action.data.link;
        return undefined;
      });
      return [...state];
    default:
      return state;
  }
};

export default menu;
