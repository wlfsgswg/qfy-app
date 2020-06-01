import React from "react";
import PropTypes from "prop-types";
import { classPrefix } from "./../../../../../../const";
import { connect } from "react-redux";
import moment from "moment";
import { MyIcon } from "./../../../../../../components";
import "./index.less";
import { Spin } from "antd";
class Top extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data } = this.props;
    const { codeTable, loading } = this.props;
    return (
      <div className={`${classPrefix}-home-personnel-roster-files-top`}>
        <Spin spinning={loading}>
          <div
            className={`${classPrefix}-home-personnel-roster-files-top-content`}
          >
            {JSON.stringify(data) !== "{}" ? (
              <div className="header clearfix">
                <div className="l-left">
                  {data.headImg ? (
                    <div className="header-top">
                      <div className="img">
                        <img src={data.headImg} alt="图片出错" />
                      </div>
                    </div>
                  ) : (
                    <div className="header-top">
                      <div className="img-text">
                        <div className="text">
                          {data.name.length < 3 ? (
                            <span>{data.name}</span>
                          ) : (
                            <span>
                              {data.name.length > 1
                                ? data.name.substring(data.name.length - 2)
                                : data.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="l-left p-l-20">
                  <div className="clearfix menu-minddle">
                    {data.name && (
                      <div className="clearfix">
                        <div className="l-left text-member-name p-r-15">
                          {data.name}
                        </div>
                        {data.status && (
                          <div className="l-left">
                            {
                              JSON.stringify(codeTable) !== "{}" &&
                                codeTable.memberstatus &&
                                codeTable.memberstatus.map((it, i) => {
                                  const text =
                                    it.keyValue === data.status + ""
                                      ? it.keyName
                                      : "";
                                  return text ? (
                                    <div className="text-member-status" key={i}>
                                      {text}
                                    </div>
                                  ) : undefined;
                                })
                              //   data.status
                            }
                          </div>
                        )}
                        {data.memberType && (
                          <div className="l-left">
                            {
                              JSON.stringify(codeTable) !== "{}" &&
                                codeTable.memberType &&
                                codeTable.memberType.map((it, i) => {
                                  const text =
                                    it.keyValue === data.memberType + ""
                                      ? it.keyName
                                      : "";
                                  return text ? (
                                    <div className="text-member-type" key={i}>
                                      {text}
                                    </div>
                                  ) : undefined;
                                })
                              // data.memberType
                            }
                          </div>
                        )}
                      </div>
                    )}
                    {data.deptName && (
                      <div className="menu-minddle-2">
                        <span>部门：</span>
                        <span> {data.deptName}</span>
                      </div>
                    )}
                    {data.joinTime && (
                      <div className="menu-minddle-3">
                        <span>入职日期：</span>
                        <span>
                          {moment(data.joinTime).format("YYYY-MM-DD")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="r-right">
                  <a href="###" style={{ color: "#497eef" }}>
                    <span className="p-r-5">下载人事证明</span>
                    <MyIcon type="iconxiazai" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="header-empty"></div>
            )}
          </div>
        </Spin>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    codeTable: state.code,
  };
};

Top.propTypes = {
  data: PropTypes.object,
  codeTable: PropTypes.object,
  loading: PropTypes.bool,
};

const TopStore = connect(mapStateToProps)(Top);

export default TopStore;
