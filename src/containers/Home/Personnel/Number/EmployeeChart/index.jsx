import React, { useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import { classPrefix } from "./../../../../../const";
import PropTypes from "prop-types";
import "./index.less";

const EmployeeChart = props => {
  useEffect(() => {
    // console.log("componentDidMount", props);
  }, []);
  // let echarts_react1 = null;
  const getEmployeeOption = employeeArr => {
    return {
      legend: {
        data: ["在职（人）"],
        top: 10,
        left: 40
      },
      tooltip: {
        trigger: "axis",
        formatter: "{b}月 <br/>在职：{c}人 "
      },
      xAxis: {
        type: "category",
        data: props.x,
        name: "（月）",
        nameTextStyle: { padding: [30, 0, 0, 0] }
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          name: "在职（人）",
          smooth: true,
          data: employeeArr,
          type: "line",
          itemStyle: {
            normal: {
              color: "#3e7bf8", //折点颜色
              lineStyle: {
                color: "#3e7bf8" //折线颜色
              }
            }
          }
        }
      ]
    };
  };
  return (
    <div className={`${classPrefix}-number-employeechart`}>
      <div className={`${classPrefix}-number-employeechart-content`}>
        <div className="employee">
          <div className="employee-title">
            <div>月末在职人数统计</div>
            <div>
              现在在职人数
              <span className="number">{props.employeeNumber}</span>人
            </div>
          </div>
        </div>
        <div style={{ width: "100%", padding: "20px 0 0 0" }}>
          <ReactEcharts
            // ref={e => {
            //   echarts_react1 = e;
            // }}
            option={getEmployeeOption(props.employeeArr)}
            notMerge={true}
            lazyUpdate={true}
            style={{ width: "100%", height: "330px" }}
          />
        </div>
      </div>
    </div>
  );
};

EmployeeChart.propTypes = {
  employeeNumber: PropTypes.number,
  employeeArrL: PropTypes.array,
  x: PropTypes.array
};

export default EmployeeChart;
