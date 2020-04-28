import React from "react";
import { classPrefix } from "./../../../const";
import { renderRoutes } from "react-router-config";
import { SecondMenu } from "./../../../components";
import { siderObject } from "./sider";
import "./index.less";
import { Layout } from "antd";
const { Sider, Content } = Layout;
class Personnel extends React.Component {
  render() {
    return (
      <div className={`${classPrefix}-home-personnel`}>
        <div className={`${classPrefix}-home-personnel-content`}>
          <Layout className="layout2">
            <Sider className="layout2-sider">
              <SecondMenu siderObject={siderObject} />
            </Sider>
            <Layout>
              <Content className="layout2-content">
                {renderRoutes(this.props.route.routes)}
              </Content>
            </Layout>
          </Layout>
          <div className="content"></div>
        </div>
      </div>
    );
  }
}

export default Personnel;
