import React from "react";
import { Button } from "antd";
import { classPrefix } from "./../../../const";
import * as DialogDemo from "./DialogDemo";
import Reauest from "./../../../utils/request";
import "./index.less";
class Message extends React.Component {
  componentDidMount() {
    Reauest.post("/api/material/2037.json", {
      name: 1,
      k: 1,
      url: "http://www.baidu.com",
    })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleOpenDialog = () => {
    DialogDemo.open({
      data: {
        name: 1,
      },
      onSuccess: () => {
        console.log("成功");
      },
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
