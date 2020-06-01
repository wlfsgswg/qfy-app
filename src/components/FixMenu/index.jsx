import React from "react";
import { classPrefix } from "./../../const";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";
import "./index.less";

class FixMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {}
  render() {
    const {
      history,
      location,
      menu,
      focus,
      changeFocus,
      deleteMenu,
    } = this.props;
    return (
      <div className={`${classPrefix}-component-fixmenu`}>
        <div className={`${classPrefix}-component-fixmenu-content clearfix`}>
          {menu.map((it, i) => (
            <div
              className={`${
                focus === it.focus ? "menu-item-focus" : ""
              } menu-item l-left `}
              key={it.focus}
              onClick={() => {
                if (location.pathname !== it.link) {
                  history.push(it.link);
                  changeFocus(it.focus);
                }
              }}
            >
              {it.title}
              {i !== 0 && (
                <div className="pos">
                  <CloseOutlined
                    className="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMenu(it);
                      changeFocus(1);
                      history.push("/");
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

FixMenu.propTypes = {
  menu: PropTypes.array,
  history: PropTypes.object,
  location: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    menu: state.menu,
    focus: state.focus,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeFocus: (e) => {
      dispatch({ type: "CHANGE-FOCUS", focus: e });
    },
    deleteMenu: (e) => {
      dispatch({ type: "DELETE-MENU", data: e });
    },
  };
};

const FixMenuStore = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(FixMenu));

export default FixMenuStore;
