import React from "react";
import { classPrefix } from "./../../../const";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
class Work extends React.Component {
  render() {
    const { history, addMenu, changeFocus } = this.props;
    return (
      <div className={`${classPrefix}-home-work`}>
        <div className={`${classPrefix}-home-work-content`}>
          <div className="top clearfix">
            <div className="l-left p-r-30">
              <Link to={"/#"}>慧云名片</Link>
            </div>
            <div className="l-left p-r-30">
              <div
                onClick={() => {
                  history.push("/personnel");
                  addMenu({ title: "智能人事", link: "/personnel", focus: 5 });
                  changeFocus(5);
                }}
              >
                智能人事
              </div>
            </div>
            <div className="l-left">虚拟号码管家</div>
          </div>
        </div>
      </div>
    );
  }
}

Work.propTypes = {
  addMenu: PropTypes.func,
  changeFocus: PropTypes.func,
  menu: PropTypes.array,
  history: PropTypes.object,
};

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

const WorkStore = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Work));

export default WorkStore;
