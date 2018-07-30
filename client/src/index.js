import React from "react";
import ReactDOM from "react-dom";
import "./assets/index.css";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers";
import { BrowserRouter as Router } from "react-router-dom";

const store = createStore(rootReducer, {}, applyMiddleware());

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
