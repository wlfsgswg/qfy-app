import React from "react";
import { Link } from "react-router-dom";
import { classPrefix } from "./../../const";
import MyIcon from "./../MyIcon";
import { menuTop, menuBottom } from "./type";
import "./index.less";
class LeftMenu extends React.Component {
  render() {
    return (
      <div className={`${classPrefix}-component-leftmenu`}>
        <div className={`${classPrefix}-component-leftmenu-content`}>
          <div className="menu">
            <div className="top">
              <img
                src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=228687868,2097824726&fm=26&gp=0.jpg"
                alt=""
              />
            </div>
            <div className="bottom">
              <div>
                {menuTop.map(it => (
                  <Link to={it.path} key={it.path}>
                    <div key={it.path} className="bottom-tabs">
                      <MyIcon type={it.icon} className="bottom-tabs-icon" />
                      <div className="bottom-tabs-title">{it.title}</div>
                    </div>
                  </Link>
                ))}
              </div>
              <div>
                {menuBottom.map(it => (
                  <Link to={it.path} key={it.path}>
                    <div className="bottom-tabs">
                      <MyIcon type={it.icon} className="bottom-tabs-icon" />
                      <div className="bottom-tabs-title">{it.title}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LeftMenu;
