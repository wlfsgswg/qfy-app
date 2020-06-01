import React from "react";
import ReactEcharts from "echarts-for-react";
import "./index.less";
import PropTypes from "prop-types";
class PieChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getOption = (arr = []) => {
    const nameArr = arr.map(item => {
      return `${item.name}  |  ${item.percent}  |  ${item.count}人`;
    });
    const dataArr = arr.map(item => {
      return {
        name: `${item.name}  |  ${item.percent}  |  ${item.count}人`,
        value: item.count
      };
    });
    return {
      // tooltip: {
      //     trigger: 'item',
      //     formatter: '{a} <br/>{b}: {c} ({d}%)'
      // },
      legend: {
        orient: "vertical",
        top: "10%",
        right: "5%",
        data: nameArr,
        textStyle: {
          color: "#999",
          fontSize: 12
        }
      },
      color: [
        "#0097fe",
        "#3c75e9",
        "#f3cf21",
        "#f4942e",
        "#19bc85",
        "#ef5742",
        "#cccccc"
      ],
      series: [
        {
          name: "",
          type: "pie",
          radius: ["55%", "70%"],
          center: ["25%", "40%"],
          avoidLabelOverlap: false,
          label: {
            position: "center",
            formatter: ["{a|在职员工}", `{b|${this.props.total}人}`].join("\n"),
            rich: {
              a: {
                color: "#999",
                height: 35,
                fontSize: 13
              },
              b: {
                fontSize: 20,
                color: "#000"
              }
            }
          },
          labelLine: {
            show: false
          },
          data: dataArr
        }
      ]
    };
  };

  render() {
    return (
      <div className="pie">
        <div className="title">{this.props.title}</div>
        <div
          className={this.props.isLeft ? "left" : null}
          style={{ width: "100%", padding: "20px 0 0 0" }}
        >
          <ReactEcharts
            ref={e => {
              this.echarts_react1 = e;
            }}
            option={this.getOption(this.props.pieData)}
            notMerge={true}
            lazyUpdate={true}
            style={{ width: "100%", height: "230px" }}
          />
        </div>
      </div>
    );
  }
}

PieChart.propTypes = {
  title: PropTypes.string,
  pieData: PropTypes.array,
  isLeft: PropTypes.bool
};

export default PieChart;
