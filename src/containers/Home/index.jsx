import React from "react";
import { withRouter } from "react-router";
import { renderRoutes } from "react-router-config";
import { LeftMenu, MyHeader } from "./../../components";
import { classPrefix } from "./../../const";
import "./index.less";
import { Layout } from "antd";

const { Header, Sider, Content } = Layout;
class Home extends React.Component {
  componentDidMount() {
    console.log(this.props.location);
  }
  render() {
    return (
      <div className={`${classPrefix}-home`}>
        <div className={`${classPrefix}-home-content`}>
          <Layout className="layout1-className">
            <Sider>
              <LeftMenu />
            </Sider>
            <Layout>
              <Header className="ant-header">
                <MyHeader />
              </Header>
              <Content>{renderRoutes(this.props.route.routes)}</Content>
            </Layout>
          </Layout>
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
