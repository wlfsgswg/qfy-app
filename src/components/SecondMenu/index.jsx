import React from "react";
import { Menu } from "antd";
import { Link, withRouter } from "react-router-dom";
import { classPrefix } from "../../const";
import { routeMatching } from "./../../utils";
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

  componentDidMount() {
    const { menu } = this.props.siderObject;
    const routes = this.handleGetRouts(menu);
    // 路由匹配分为两种，一是进入页面直接进行匹配，二次操控history进行匹配
    // 第一种
    const mountPath = this.props.history.location.pathname;
    // 此处只考虑了二级路由，如果是一级路由会走默认值
    // 先走默认值
    this.setState({ current: menu[0].title });
    // 匹配
    routes.map((m) => {
      if (m.path === mountPath) this.setState({ current: m.title });
      return undefined;
    });
    // 第二种
    this.props.history.listen((route) => {
      const path = routeMatching(route.pathname, 2);
      // 先走默认值
      this.setState({ current: menu[0].title });
      // 寻找匹配
      routes.map((l) => {
        if (l.path === path) this.setState({ current: l.title });
        return undefined;
      });
    });
  }
  // 整理路由数组
  handleGetRouts = (e) => {
    const routes = [];
    e.map((item) => {
      if (!item.path) {
        item.children.map((it) => {
          routes.push({ path: it.path, title: it.title });
          return undefined;
        });
      }
      if (item.path) routes.push({ path: item.path, title: item.title });
      return undefined;
    });
    return routes;
  };

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
            // onClick={(e) => this.setState({ current: e.key })}
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
export default withRouter(SecondMenu);
