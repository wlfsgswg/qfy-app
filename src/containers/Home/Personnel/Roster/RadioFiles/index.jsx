import React from "react";
import { classPrefix } from "./../../../../../const";
import { TitleBack } from "./../../../../../components";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Layout, Tabs, Timeline } from "antd";
import Top from "./Top";
import Basic from "./Basic";
import Data from "./Data";
import Op from "./Op";
import Contract from "./Contract";
import "./index.less";
import ImgFilesNo from "./../../../../../public/images/roster-files-no.jpg";
const { Sider, Content } = Layout;
const { TabPane } = Tabs;

class RadioFiles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rightContent: [],
      data: {},
      loading: false,
      rightLoading: false,
      activeKey: "0",
    };
  }

  componentDidMount() {
    const { id } =
      this.props.match && this.props.match.params && this.props.match.params;
    this.handleGetDetail(id);
    this.handleGetRightContent();
  }

  handleGetDetail = (e) => {
    this.setState({ loading: true });
    Request.post(`member/infoJson`, { id: e })
      .then((res) => {
        if (res.status === 200) {
          this.setState({ data: res.data, loading: false });
        }
      })
      .catch(() => this.setState({ loading: false }));
  };
  // 获取右侧详情
  handleGetRightContent = () => {
    const { match } = this.props;
    const id = match && match.params && match.params.id && match.params.id;
    this.setState({ rightLoading: true });
    Request.post(`/logMemberOperate/listJson`, { type: 2, memberId: id })
      .then((res) => {
        if (res.status === 200) {
          this.setState({ rightContent: res.data.list, rightLoading: false });
        }
      })
      .catch(() => this.setState({ rightLoading: false }));
  };

  render() {
    const { rightContent, data, loading, activeKey } = this.state;
    return (
      <div className={`${classPrefix}-home-personnel-roster-files`}>
        <div className={`${classPrefix}-home-personnel-roster-files-content`}>
          <Layout className="layout3">
            <Content className="layout3-content">
              <div className="top">
                <div className="top-content">
                  <TitleBack
                    onBack={() => this.props.history.push("/personnel/roster")}
                  >
                    员工档案编辑
                  </TitleBack>
                  <div className="p-b-15">
                    <Top data={data} loading={loading} />
                  </div>
                  <Tabs
                    activeKey={activeKey}
                    onChange={(e) => {
                      this.setState({ activeKey: e });
                    }}
                  >
                    <TabPane tab="基本信息" key="0"></TabPane>
                    <TabPane tab="合同信息" key="1"></TabPane>
                    <TabPane tab="资料上传" key="2"></TabPane>
                    <TabPane tab="操作记录" key="3">
                      {" "}
                    </TabPane>
                  </Tabs>
                  <div className="top-tab-div">
                    {activeKey === "0" ? (
                      <Basic />
                    ) : activeKey === "1" ? (
                      <Contract />
                    ) : activeKey === "2" ? (
                      <Data />
                    ) : (
                      <Op />
                    )}
                  </div>
                </div>
              </div>
            </Content>
            <Sider className="layout3-sider">
              <div className="layout3-sider-content">
                {rightContent.length ? (
                  <div className="layout3-sider-content-yes">
                    <Timeline mode={"left"} className="time-line">
                      {rightContent.map((it, i) => (
                        <Timeline.Item label={it.inputTime} key={i}>
                          <div className="time-line-content">
                            {it.content ? it.content : "--"}
                          </div>
                          <div className="time-line-text c999">
                            <span>操作人：</span>
                            <span>{it.inputName ? it.inputName : "--"}</span>
                          </div>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </div>
                ) : (
                  <div className="layout3-sider-content-no">
                    <img src={ImgFilesNo} alt="" />
                    <p className="c999">暂无信息</p>
                  </div>
                )}
              </div>
            </Sider>
          </Layout>
        </div>
      </div>
    );
  }
}
RadioFiles.propTypes = {
  match: PropTypes.object,
};
export default withRouter(RadioFiles);
