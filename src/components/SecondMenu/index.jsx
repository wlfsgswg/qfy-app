import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { classPrefix } from "../../const";
import PropTypes from "prop-types";
import "./index.less";
const { SubMenu } = Menu;

class SecondMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: this.props.siderObject.openKeys,
      current: this.props.siderObject.current,
    };
  }

  render() {
    const { menu } = this.props.siderObject;
    const { openKeys, current } = this.state;
    return (
      <div className={`${classPrefix}-component-secondmenu`}>
        <div className={`${classPrefix}-component-secondmenu-content`}>
          <Menu
            mode="inline"
            openKeys={openKeys}
            onOpenChange={(e) => this.setState({ openKeys: e })}
            className="menu1"
            selectedKeys={[current]}
            onClick={(e) => this.setState({ current: e.key })}
          >
            {menu.map((item) => {
              return item.path ? (
                <Menu.Item key={item.title} title={item.title}>
                  <Link to={item.path}> {item.title}</Link>
                </Menu.Item>
              ) : (
                <SubMenu key={item.title} title={<span>{item.title}</span>}>
                  {item.children &&
                    item.children.length &&
                    item.children.map((it) => (
                      <Menu.Item key={it.title} title={it.title}>
                        <Link to={it.path}> {it.title}</Link>
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

SecondMenu.propTypes = {
  siderObject: PropTypes.object,
};
export default SecondMenu;
