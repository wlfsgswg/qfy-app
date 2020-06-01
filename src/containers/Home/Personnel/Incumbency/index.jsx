import React from "react";
import { classPrefix } from "./../../../../const";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Title } from "./../../../../components";
import { Spin } from "antd";
import "./index.less";
import PieChart from "./PieChart";

class Incumbency extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workYearLoading: false, // 工龄学历数据loading
      total: 0, // 共有多少职工
      workYearArr: [], // 工龄
      educationArr: [], // 学历
      ageLoading: false, // 年龄婚姻数据loading
      ageArr: [], // 年龄
      marriageArr: [], // 婚姻
      sexLoading: false, // 性别状态数据loading
      sexArr: [], // 性别
      statusArr: [], // 状态
    };
  }

  componentDidMount() {
    this.getWorkYearAndEducation();
    this.getAgeAndMarriage();
    this.getSexAndStatus();
  }
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }

  getWorkYearAndEducation = () => {
    // 获取工龄和学历
    this.setState({
      workYearLoading: true,
    });
    Request.post(`/reportMember/getEducationAndSeniority`, {})
      .then((res) => {
        if (res.status === 200) {
          const data = res.data;
          // console.log("工龄和学历", data);
          const workYearArr = data.seniorityList;
          const educationArr = data.educationList;
          this.setState({
            total: data.totalNum,
            workYearArr,
            educationArr,
            workYearLoading: false,
          });
        }
      })
      .catch((e) => {
        // console.log(e);
        this.setState({ workYearLoading: false });
      });
  };

  getAgeAndMarriage = () => {
    // 获取年龄和婚姻
    this.setState({
      ageLoading: true,
    });
    Request.post(`/reportMember/getAgeAndMarital`, {})
      .then((res) => {
        if (res.status === 200) {
          const data = res.data;
          // console.log("年龄和婚姻", data);
          this.setState({
            ageArr: data.ageList,
            marriageArr: data.maritalList,
            ageLoading: false,
          });
        }
      })
      .catch((e) => {
        // console.log(e);
        this.setState({ ageLoading: false });
      });
  };

  getSexAndStatus = () => {
    // 获取性别和状态
    this.setState({
      sexLoading: true,
    });
    Request.post(`/reportMember/getSexAndWork`, {})
      .then((res) => {
        if (res.status === 200) {
          const data = res.data;
          // console.log("性别和状态", data);
          this.setState({
            sexLoading: false,
            sexArr: data.sexList,
            statusArr: data.workList,
          });
        }
      })
      .catch((e) => {
        // console.log(e);
        this.setState({
          sexLoading: false,
        });
      });
  };

  render() {
    return (
      <div className={`${classPrefix}-home-personnel-incumbency`}>
        <div className={`${classPrefix}-home-personnel-incumbency-content`}>
          <div className="top">
            <Title>在职员工统计</Title>
          </div>
          <Spin spinning={this.state.workYearLoading}>
            <div className="pie-bar">
              <PieChart
                total={this.state.total}
                isLeft={true}
                pieData={this.state.workYearArr}
                title="在职员工工龄统计"
              />
              <PieChart
                total={this.state.total}
                pieData={this.state.educationArr}
                title="在职员工学历统计"
              />
            </div>
          </Spin>
          <Spin spinning={this.state.ageLoading}>
            <div className="pie-bar">
              <PieChart
                total={this.state.total}
                isLeft={true}
                pieData={this.state.ageArr}
                title="在职员工年龄统计"
              />
              <PieChart
                total={this.state.total}
                pieData={this.state.marriageArr}
                title="在职员工婚姻统计"
              />
            </div>
          </Spin>
          <Spin spinning={this.state.sexLoading}>
            <div className="pie-bar">
              <PieChart
                total={this.state.total}
                isLeft={true}
                pieData={this.state.sexArr}
                title="在职员工性别统计"
              />
              <PieChart
                total={this.state.total}
                pieData={this.state.statusArr}
                title="在职员工状态统计"
              />
            </div>
          </Spin>
        </div>
      </div>
    );
  }
}

Incumbency.propTypes = {
  location: PropTypes.object,
};

export default withRouter(Incumbency);
