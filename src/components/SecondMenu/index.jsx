import React from "react";
import { classPrefix } from "../../const";
import "./index.less";
import { sidebarObject } from "./ceshi";
import { Menu } from "antd";
const { SubMenu } = Menu;

class SecondMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { openKeys, menu } = sidebarObject;
    return (
      <div className={`${classPrefix}-component-secondmenu`}>
        <div className={`${classPrefix}-component-secondmenu-content`}>
          <Menu
            mode="inline"
            openKeys={openKeys}
            onOpenChange={(e) => this.setState({ openKeys: e })}
            className="menu1"
          >
            {menu.map((item) => {
              return item.path ? (
                <Menu.Item key={item.title} title={item.title}>
                  {item.title}
                </Menu.Item>
              ) : (
                <SubMenu key={item.title} title={<span>{item.title}</span>}>
                  {item.children &&
                    item.children.length &&
                    item.children.map((it) => (
                      <Menu.Item key={it.title} title={it.title}>
                        {it.title}
                      </Menu.Item>
                    ))}
                </SubMenu>
              );
            })}
          </Menu>
        </div>
      </div>
    );
  }
}

export default SecondMenu;
