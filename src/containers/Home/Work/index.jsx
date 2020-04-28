import React from "react";
import { classPrefix } from "./../../../const";
import { Link } from "react-router-dom";
class Work extends React.Component {
  render() {
    return (
      <div className={`${classPrefix}-home-work`}>
        <div className={`${classPrefix}-home-work-content`}>
          <div className="top clearfix">
            <div className="l-left p-r-30">
              <Link to={"/#"}>慧云名片</Link>
            </div>
            <div className="l-left p-r-30">
              <Link to="/personnel">智能人事</Link>
            </div>
            <div className="l-left">虚拟号码管家</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Work;
