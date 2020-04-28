import React from "react";
import { classPrefix } from "../../const";
import MyIcon from "./../MyIcon";
import { menu } from "./type";
import "./index.less";
class MyHeader extends React.Component {
  render() {
    return (
      <div className={`${classPrefix}-component-header`}>
        <div className={`${classPrefix}-component-header-content`}>
          <div className="clearfix top">
            <div className="r-right">
              <div className="clearfix">
                {menu.map((it, i) => (
                  <div className={`class-${i} l-left p-r-15 `} key={it.title}>
                    <MyIcon type={it.icon} className="top-icon" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MyHeader;
