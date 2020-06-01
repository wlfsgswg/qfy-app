import React from "react";
import { classPrefix } from "./../../../../../../const";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Timeline, Spin } from "antd";
import "./index.less";
class Op extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const id = match && match.params && match.params.id && match.params.id;
    this.setState({ loading: true });
    Request.post(`/logMemberOperate/listJson`, { type: 1, memberId: id })
      .then((res) => {
        if (res.status === 200) {
          this.setState({ data: res.data.list, loading: false });
        }
      })
      .catch(() => this.setState({ loading: false }));
  }
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }

  render() {
    const { data, loading } = this.state;
    return (
      <div className={`${classPrefix}-home-personnel-roster-files-op`}>
        <div
          className={`${classPrefix}-home-personnel-roster-files-op-content`}
        >
          <Spin spinning={loading}>
            <div className="content">
              {data.length !== 0 ? (
                <Timeline mode={"left"} className="time-line">
                  {data.map((it, i) => (
                    <Timeline.Item label={it.inputTime} key={i}>
                      <div className="time-line-content">
                        {it.content ? it.content : "--"}
                      </div>
                      <div className="time-line-text">
                        <span>操作人：</span>
                        <span>{it.inputName ? it.inputName : "--"}</span>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              ) : (
                <div style={{ minHeight: "500px" }}></div>
              )}
            </div>
          </Spin>
        </div>
      </div>
    );
  }
}
Op.propTypes = {
  match: PropTypes.object,
};

export default withRouter(Op);
