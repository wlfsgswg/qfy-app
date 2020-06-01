import Search from "./Search";
import React from "react";
import { classPrefix } from "./../../../../const";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Title } from "./../../../../components";
import "./index.less";
import moment from "moment";
import { Spin } from "antd";
import EmployeeChart from "./EmployeeChart";
import EnterAndQuitChart from "./EnterAndQuitChart";

class Number extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      year: moment(),
      loading: false,
      employeeNumber: 0,
      employeeArr: [], // 在职人数组
      x: [], // x轴
      enterArr: [], // 入职人数组
      quitArr: [], // 离职人数组
    };
  }
  componentDidMount() {
    // console.log(this.props);
    this.getData();
  }
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }

  handleSummit = (value) => {
    // console.log(value);
    this.setState(
      {
        year: value.year,
      },
      () => {
        this.getData();
      }
    );
  };

  getData = () => {
    this.setState({
      loading: true,
    });
    Request.post(`/reportMember/getMemberNum`, {
      dateYear: moment(this.state.year).format("YYYY"),
    })
      .then((res) => {
        if (res.status === 200) {
          // console.log(res.data);
          const employeeArr = (Object.values(res.data.list) || []).map(
            (item) => {
              return item.workerNum;
            }
          );
          const x = Object.keys(res.data.list);
          const enterArr = (Object.values(res.data.list) || []).map((item) => {
            return item.entryNum;
          });
          const quitArr = (Object.values(res.data.list) || []).map((item) => {
            return item.quitNum;
          });
          // console.log(
          //   "---在职人数",
          //   employeeArr,
          //   "----入职人数",
          //   enterArr,
          //   "----离职人数",
          //   quitArr
          // );
          this.setState({
            employeeNumber: res.data.totalWorkerNum,
            employeeArr,
            x,
            enterArr,
            quitArr,
            loading: false,
          });
        }
      })
      .catch((e) => {
        // console.log(e);
        this.setState({ loading: false });
      });
  };

  render() {
    return (
      <div className={`${classPrefix}-home-personnel-number`}>
        <div className={`${classPrefix}-home-personnel-number-content`}>
          <div className="top">
            <Title>员工数量统计</Title>
          </div>
          <div className="tool-bar">
            <Search
              onSummit={this.handleSummit}
              defaultValue={{ year: this.state.year }}
            />
          </div>
          <Spin spinning={this.state.loading}>
            <EmployeeChart
              x={this.state.x}
              employeeNumber={this.state.employeeNumber}
              employeeArr={this.state.employeeArr}
            />
            <EnterAndQuitChart
              x={this.state.x}
              enterArr={this.state.enterArr}
              quitArr={this.state.quitArr}
            />
          </Spin>
        </div>
      </div>
    );
  }
}

Number.propTypes = {
  location: PropTypes.object,
};

export default withRouter(Number);
