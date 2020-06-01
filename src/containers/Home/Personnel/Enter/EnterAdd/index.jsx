import React from "react";
import { classPrefix } from "./../../../../../const";
import "./index.less";
import Add from "./../../Roster/RosterAdd";
class EnterAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={`${classPrefix}-home-personnel-enter-add`}>
        <div className={`${classPrefix}-home-personnel-enter-add-content`}>
          <Add
            history={this.props.history}
            preUrl={"/personnel/entry"}
            preTitle={"办理入职"}
          />
        </div>
      </div>
    );
  }
}

EnterAdd.propTypes = {};

export default EnterAdd;
