import React from "react";
import { classPrefix } from "./../../const";
import MyIcon from "./../MyIcon";
import { menuTop, menuBottom, focusMenu } from "./type";
import { routeMatching } from "./../../utils";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./index.less";
class LeftMenu extends React.Component {
  componentDidMount() {
    const { addMenu, changeFocus } = this.props;
    const mountPath = routeMatching(this.props.history.location.pathname);
    focusMenu.map((it) => {
      if (it.path === mountPath) {
        addMenu({ link: it.path, focus: it.focus, title: it.title });
        changeFocus(it.focus);
      }
      return undefined;
    });
  }
  render() {
    const { history, addMenu, changeFocus } = this.props;
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
                {menuTop.map((it) => (
                  <div
                    key={it.path}
                    className="bottom-tabs"
                    onClick={() => {
                      history.push(it.path);
                      addMenu({
                        title: it.title,
                        link: it.path,
                        focus: it.focus,
                      });
                      changeFocus(it.focus);
                    }}
                  >
                    <MyIcon type={it.icon} className="bottom-tabs-icon" />
                    <div className="bottom-tabs-title">{it.title}</div>
                  </div>
                ))}
              </div>
              <div>
                {menuBottom.map((it) => (
                  <div
                    className="bottom-tabs"
                    key={it.path}
                    onClick={() => {
                      history.push(it.path);
                      addMenu({
                        title: it.title,
                        link: it.path,
                        focus: it.focus,
                      });
                      changeFocus(it.focus);
                    }}
                  >
                    <MyIcon type={it.icon} className="bottom-tabs-icon" />
                    <div className="bottom-tabs-title">{it.title}</div>
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
const mapStateToProps = (state) => {
  return {
    menu: state.menu,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addMenu: (e) => {
      dispatch({ type: "ADD-MENU", data: e });
    },
    changeFocus: (e) => {
      dispatch({ type: "CHANGE-FOCUS", focus: e });
    },
  };
};

const LeftMenuStore = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LeftMenu));

export default LeftMenuStore;
