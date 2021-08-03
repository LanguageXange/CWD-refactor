import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import App2 from "./FuncApp";
import registerServiceWorker from "./registerServiceWorker";
import "tachyons";

ReactDOM.render(<App2 />, document.getElementById("root"));
registerServiceWorker();
