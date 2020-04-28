import React from "react";
import { classPrefix } from "../../const";
import "./index.less";
class SecondMenu extends React.Component {
  render() {
    return (
      <div className={`${classPrefix}-component-secondmenu`}>
        <div className={`${classPrefix}-component-secondmenu-content`}></div>
      </div>
    );
  }
}

export default SecondMenu;
