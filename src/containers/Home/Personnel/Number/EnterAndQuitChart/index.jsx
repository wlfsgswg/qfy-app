import React, { useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import { classPrefix } from "./../../../../../const";
import PropTypes from "prop-types";
import "./index.less";

const EnterAndQuitChart = props => {
  useEffect(() => {
    // console.log("componentDidMount");
  }, []);
  // let echarts_react2 = null;
  const getEnterAndQuitOption = (enterArr, quitArr) => {
    return {
      legend: {
        data: ["入职（人）", "离职（人）"],
        top: 10,
        left: 40
      },
      tooltip: {
        trigger: "axis",
        formatter: "{b}月 <br/>入职：{c}人 <br/>离职：{c1}人 "
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
          name: "入职（人）",
          smooth: true,
          data: enterArr,
          type: "line",
          itemStyle: {
            normal: {
              color: "#3e7bf8", //折点颜色
              lineStyle: {
                color: "#3e7bf8" //折线颜色
              }
            }
          }
        },
        {
          name: "离职（人）",
          smooth: true,
          data: quitArr,
          type: "line",
          itemStyle: {
            normal: {
              color: "#f3d12c", //折点颜色
              lineStyle: {
                color: "#f3d12c" //折线颜色
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
            <div>入职人数和离职人数统计</div>
            <div></div>
          </div>
        </div>
        <div style={{ width: "100%", padding: "20px 0" }}>
          <ReactEcharts
            // ref={e => {
            //   echarts_react2 = e;
            // }}
            option={getEnterAndQuitOption(props.enterArr, props.quitArr)}
            notMerge={true}
            lazyUpdate={true}
            style={{ width: "100%", height: "330px" }}
          />
        </div>
      </div>
    </div>
  );
};

EnterAndQuitChart.propTypes = {
  enterArr: PropTypes.array,
  quitArr: PropTypes.array,
  x: PropTypes.array
};

export default EnterAndQuitChart;
