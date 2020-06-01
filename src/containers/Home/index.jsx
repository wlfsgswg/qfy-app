import React from "react";
import { withRouter } from "react-router";
import { renderRoutes } from "react-router-config";
import { LeftMenu, MyHeader, FixMenu } from "./../../components";
import { classPrefix } from "./../../const";
import "./index.less";
import { Layout } from "antd";

const { Header, Sider, Content } = Layout;
class Home extends React.Component {
  componentDidMount() {}
  render() {
    return (
      <div className={`${classPrefix}-home`}>
        <div className={`${classPrefix}-home-content`}>
          <Layout className="layout1">
            <Sider className="layout1-sider">
              <LeftMenu />
            </Sider>
            <Layout>
              <Header className="layout1-header">
                <MyHeader />
              </Header>
              <FixMenu />
              <Content className="layout1-content">
                {renderRoutes(this.props.route.routes)}
              </Content>
            </Layout>
          </Layout>
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
