import React from "react";
import { classPrefix } from "./../../../const";
import { renderRoutes } from "react-router-config";
import { SecondMenu } from "./../../../components";
import "./index.less";
// import { Layout } from "antd";
// const { Sider, Content } = Layout;
class Personnel extends React.Component {
  render() {
    return (
      <div className={`${classPrefix}-home-personnel`}>
        <div className={`${classPrefix}-home-personnel-content`}>
          <SecondMenu />
          <div>{renderRoutes(this.props.route.routes)}</div>

          {/* <Layout className="layout2-className">
            <Sider>
             
            </Sider>
            <Layout>
              <Content></Content>
            </Layout>
          </Layout> */}
          <div className="content"></div>
        </div>
      </div>
    );
  }
}

export default Personnel;
