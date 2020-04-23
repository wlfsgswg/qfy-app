import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dialog } from "./../../../../components";

class DialogDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { afterClose, getContainer, onSuccess } = this.props;
    return (
      <Dialog
        title={"Demo"}
        closable={true}
        afterClose={afterClose}
        getContainer={getContainer}
        width={500}
        onOk={() => {
          afterClose();
          onSuccess();
        }}
      >
        <h3>我是dialogDemo</h3>
      </Dialog>
    );
  }
}
DialogDemo.propTypes = {
  afterClose: PropTypes.func,
  getContainer: PropTypes.func,
  data: PropTypes.object,
  onSuccess: PropTypes.func,
};

const open = (props) => {
  Dialog.OpenDialog({}, <DialogDemo {...props} />);
};

export { open };
