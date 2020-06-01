import React from "react";
import { classPrefix } from "./../../../../const";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import "./index.less";
import Search from "./Search";
import { Title } from "./../../../../components";
import PieChart from "./PieChart";
import { Spin } from "antd";

class Statistics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dimissionTimeArr: [],
      total: 0,
      departmentLoading: false,
      departmentArr: [],
      workYearArr: [],
      reasonLoading: false,
      reasonArr: [],
    };
  }
  componentDidMount() {
    this.getDepartmentAndworkYear();
    this.getReason();
  }
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }
  search = (value) => {
    // console.log(value)
    this.setState(
      {
        dimissionTimeArr: value.dimissionTimeArr || [],
      },
      () => {
        this.getDepartmentAndworkYear();
        this.getReason();
      }
    );
  };

  getDepartmentAndworkYear = () => {
    this.setState({
      departmentLoading: true,
    });
    Request.post(`/reportMember/getDimissionDepartAndworkYears`, {
      dimissionTimeArr: this.state.dimissionTimeArr,
    })
      .then((res) => {
        if (res.status === 200) {
          const data = res.data;
          // console.log("离职的部门和工龄", data);
          this.setState({
            total: data.totalNum,
            workYearArr: data.workYearsList,
            departmentArr: data.deptList,
            departmentLoading: false,
          });
        }
      })
      .catch((e) => {
        // console.log(e);
        this.setState({ departmentLoading: false });
      });
  };

  getReason = () => {
    this.setState({
      reasonLoading: true,
    });
    Request.post(`/reportMember/getDimissionReasons`, {
      dimissionTimeArr: this.state.dimissionTimeArr,
    })
      .then((res) => {
        if (res.status === 200) {
          const data = res.data;
          // console.log("离职原因", data);
          this.setState({
            reasonArr: data.resaonList,
            reasonLoading: false,
          });
        }
      })
      .catch((e) => {
        // console.log(e);
        this.setState({ reasonLoading: false });
      });
  };

  render() {
    return (
      <div className={`${classPrefix}-home-personnel-statistics`}>
        <div className={`${classPrefix}-home-personnel-statistics-content`}>
          <div className="top">
            <Title>在职员工统计</Title>
          </div>
          <div className="tool-bar">
            <Search onSummit={this.search} />
          </div>
          <Spin spinning={this.state.departmentLoading}>
            <div className="pie-bar">
              <PieChart
                total={this.state.total}
                isLeft={true}
                pieData={this.state.departmentArr}
                title="离职部门分布统计"
              />
              <PieChart
                total={this.state.total}
                pieData={this.state.workYearArr}
                title="离职工龄统计"
              />
            </div>
          </Spin>
          <Spin spinning={this.state.reasonLoading}>
            <div className="pie-bar">
              <PieChart
                total={this.state.total}
                isLeft={true}
                pieData={this.state.reasonArr}
                title="离职原因统计"
              />
            </div>
          </Spin>
        </div>
      </div>
    );
  }
}

Statistics.propTypes = {
  location: PropTypes.object,
};

export default withRouter(Statistics);
