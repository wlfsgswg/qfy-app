import React, { Component } from "react";
import { HashRouter as Router } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import { routes } from "./routes";
import { classPrefix } from './const'

class App extends Component {
  render() {
    return (
      <div className={`${classPrefix}-app`}>
        <Router>{renderRoutes(routes)}</Router>
      </div>
    );
  }
}

export default App;