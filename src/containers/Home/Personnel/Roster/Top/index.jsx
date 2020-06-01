import React from "react";
import { classPrefix } from "./../../../../../const";
import { MyIcon } from "./../../../../../components";
import { Spin } from "antd";
import PropTypes from "prop-types";
import { top1, top2, top3 } from "./type";
import "./index.less";
class Top extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      top1: top1,
      top2: top2,
      top3: top3,
      loading: false,
      focus: "",
      focusMenu: "",
    };
  }
  componentDidMount() {
    const top1Length = top1.length;
    const top2Length = top2.length;
    top1.map((it, i) => (it.key = i));
    top2.map((it, i) => (it.key = i + top1Length));
    top3.map((it, i) => (it.key = i + top1Length + top2Length));
    this.handleGetTopList();
  }
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }

  // 请求原始数据
  handleGetTopList = () => {
    this.setState({ loading: true });
    Request.post(`/member/findIndexReportData`, {}).then((res) => {
      // console.log(res.data);
      const objectKeys = Object.keys(res.data);
      const objectValues = Object.values(res.data);
      objectKeys.map((item, i) => {
        top1.map((it) => {
          if (it.status === item) it.num = objectValues[i];
          return undefined;
        });
        top2.map((it) => {
          if (it.status === item) it.num = objectValues[i];
          return undefined;
        });
        top3.map((it) => {
          if (it.status === item) it.num = objectValues[i];
          return undefined;
        });

        return undefined;
      });
      this.setState({ top1, top2, top3, loading: false });
    });
  };

  // 高亮选中框选中项
  handleChangeTabs = (e) => {
    const { onSelect } = this.props;
    const [top1Length, top2Length, focus, tabs] = [
      top1.length,
      top2.length,
      e,
      [],
    ];
    const focusMenu = e < top1Length ? 0 : e < top1Length + top2Length ? 1 : 2;
    // 选中对象回调
    top1.map((it) => tabs.push(it));
    top2.map((it) => tabs.push(it));
    top3.map((it) => tabs.push(it));
    let obj;
    tabs.map((item) => {
      if (item.key === e) obj = item;
      return undefined;
    });
    this.setState(
      {
        focus: focus,
        focusMenu: focusMenu,
      },
      () => onSelect({ ...obj, focus: focus, focusMenu: focusMenu })
    );
  };

  render() {
    const { focus, focusMenu } = this.state;
    const { top1, top2, top3, loading } = this.state;
    return (
      <div className={`${classPrefix}-home-personnel-roster-top`}>
        <Spin spinning={loading}>
          <div className={`${classPrefix}-home-personnel-roster-top-content`}>
            <div
              className={`${focusMenu === 0 ? "focus-border cell" : "cell"}`}
            >
              {top1.map((it, i) =>
                i === 0 ? (
                  <div key={i} className="cell-ul cell-ul2">
                    <div
                      className={`${
                        it.key === focus
                          ? "focus cell-li cell-li2"
                          : "cell-li cell-li2"
                      }`}
                      onClick={() => this.handleChangeTabs(it.key)}
                    >
                      {it.title}
                      <span className="num-zz">{it.num}</span>人
                    </div>
                  </div>
                ) : (
                  <div key={i} className="cell-ul">
                    <div
                      className={`${
                        it.key === focus ? "focus cell-li" : "cell-li"
                      }`}
                      onClick={() => this.handleChangeTabs(it.key)}
                    >
                      <div className="title">{it.title}</div>
                      <div className="num">{it.num}人</div>
                    </div>
                  </div>
                )
              )}
              <div className="pos">
                <MyIcon type="iconsanjiaoxing" className="icon" />
              </div>
            </div>
            <div
              className={`${focusMenu === 1 ? "focus-border cell" : "cell"}`}
            >
              {top2.map((it, i) => (
                <div key={i} className={`${i === 0 ? "p-l-5-i" : ""} cell-ul`}>
                  <div
                    className={`${i === 0 ? "cell-li2" : ""} ${
                      it.key === focus ? "focus" : ""
                    }  cell-li`}
                    onClick={() => this.handleChangeTabs(it.key)}
                  >
                    <div className="title">{it.title}</div>
                    <div className="num">{it.num}人</div>
                  </div>
                </div>
              ))}
              <div className="pos">
                <MyIcon type="iconsanjiaoxing" className="icon" />
              </div>
            </div>
            <div
              className={`${focusMenu === 2 ? "focus-border cell" : "cell"}`}
            >
              {top3.map((it, i) => (
                <div key={i} className={`${i === 0 ? "p-l-5-i" : ""} cell-ul`}>
                  <div
                    className={`${i === 0 ? "cell-li2" : ""} ${
                      it.key === focus ? "focus" : ""
                    } cell-li`}
                    onClick={() => this.handleChangeTabs(it.key)}
                  >
                    <div className="title">{it.title}</div>
                    <div className="num">
                      <span>{it.num}</span>人
                    </div>
                  </div>
                </div>
              ))}
              <div className="pos">
                <MyIcon type="iconsanjiaoxing" className="icon" />
              </div>
            </div>
          </div>
        </Spin>
      </div>
    );
  }
}

Top.propTypes = {
  onSelect: PropTypes.func,
};

export default Top;
