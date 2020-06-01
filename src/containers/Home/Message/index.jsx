import React from "react";
import { Button } from "antd";
import { classPrefix } from "./../../../const";
import * as DialogDemo from "./DialogDemo";
import "./index.less";
class Message extends React.Component {
  componentDidMount() {}

  handleOpenDialog = () => {
    DialogDemo.open({
      data: {
        name: 1,
      },
      onSuccess: () => {},
    });
  };
  render() {
    return (
      <div className={`${classPrefix}-home-message`}>
        <div className={`${classPrefix}-home-message-content`}>
          <div className="p-t-30 p-l-30">
            <Button type="primary" onClick={this.handleOpenDialog}>
              Primary
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Message;
