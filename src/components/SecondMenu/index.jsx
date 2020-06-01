import React from "react";
import { Menu } from "antd";
import { withRouter } from "react-router-dom";
import { classPrefix } from "../../const";
import { routeMatching } from "./../../utils";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { focusMenu } from "./../LeftMenu/type";
import "./index.less";
const { SubMenu } = Menu;
let UNLISTEN;
class SecondMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: this.props.siderObject.openKeys,
      current: this.props.siderObject.current,
    };
  }

  componentDidMount() {
    const { changeMenu, changeFocus } = this.props;
    const { menu } = this.props.siderObject;
    const routes = this.handleGetRouts(menu);
    // 路由匹配分为两种，一是进入页面直接进行匹配，二次操控history进行匹配
    // 第一种 浏览器刷新
    const mountPath = routeMatching(this.props.history.location.pathname, 2);
    // 此处只考虑了二级路由，如果是一级路由会走默认值\
    // 先走默认值
    this.setState({ current: menu.length && menu[0].title });
    // 匹配
    routes.length &&
      routes.map((m) => {
        if (m.path === mountPath) this.setState({ current: m.title });
        return undefined;
      });
    // 第二种 通过浏览器左端箭头手动改变history
    UNLISTEN = this.props.history.listen((route) => {
      const path = routeMatching(route.pathname, 2);
      // 先走默认值
      this.setState({ current: menu.length && menu[0].title });
      // 寻找匹配
      routes.length &&
        routes.map((l) => {
          if (l.path === path) this.setState({ current: l.title });
          return undefined;
        });
      // 分割线，此处和路由匹配没有太大关系只是用来处理头部的显示bar的
      const myBasicPath = routeMatching(route.pathname);
      focusMenu.map((it) => {
        if (it.path === myBasicPath) {
          changeMenu({ link: route.pathname, focus: it.focus });
          changeFocus(it.focus);
        }
        return undefined;
      });
    });
  }

  componentWillUnmount() {
    UNLISTEN && UNLISTEN(); // 执行解绑
  }
  // 整理路由数组
  handleGetRouts = (e) => {
    const routes = [];
    e.length &&
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
    const { history, siderObject } = this.props;
    const { menu } = siderObject;
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
          >
            {menu.length &&
              menu.map((item) => {
                return item.path ? (
                  <Menu.Item key={item.title} title={item.title}>
                    <div
                      onClick={() => {
                        history.push(item.path);
                      }}
                    >
                      {item.title}
                    </div>
                  </Menu.Item>
                ) : (
                  <SubMenu key={item.title} title={<span>{item.title}</span>}>
                    {item.children &&
                      item.children.length &&
                      item.children.map((it) => (
                        <Menu.Item key={it.title} title={it.title}>
                          <div
                            onClick={() => {
                              history.push(it.path);
                            }}
                          >
                            {it.title}
                          </div>
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
  changeMenu: PropTypes.func,
  changeFocus: PropTypes.func,
  history: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeMenu: (e) => {
      dispatch({ type: "CHANGE-MENU", data: e });
    },
    changeFocus: (e) => {
      dispatch({ type: "CHANGE-FOCUS", focus: e });
    },
  };
};

const SecondMenuStore = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SecondMenu));

export default SecondMenuStore;
