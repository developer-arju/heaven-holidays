import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./redux/store";
import App from "./App.jsx";
import "./index.css";
import io from "socket.io-client";
const socket = io.connect(import.meta.env.VITE_SERVER_URI);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Provider store={store}>
      <App socket={socket} />
    </Provider>
  </BrowserRouter>
  // </React.StrictMode>
);
