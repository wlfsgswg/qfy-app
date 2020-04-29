import React from "react";
import { classPrefix } from "./../../const";
import { renderRoutes } from "react-router-config";
import SecondMenu from "./../SecondMenu";
import { Layout } from "antd";
import PropTypes from "prop-types";
import "./index.less";

const { Sider, Content } = Layout;
class MyContent extends React.Component {
  render() {
    const { routes, siderObject } = this.props;
    return (
      <div className={`${classPrefix}-component-mycontent`}>
        <div className={`${classPrefix}-component-mycontent-content`}>
          <Layout className="layout2">
            <Sider className="layout2-sider">
              <SecondMenu siderObject={siderObject} />
            </Sider>
            <Layout>
              <Content className="layout2-content">
                {renderRoutes(routes)}
              </Content>
            </Layout>
          </Layout>
        </div>
      </div>
    );
  }
}

MyContent.propTypes = {
  siderObject: PropTypes.object,
  routes: PropTypes.array,
};

export default MyContent;
