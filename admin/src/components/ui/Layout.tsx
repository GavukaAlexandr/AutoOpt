import * as React from "react";
import { Layout } from "react-admin";
import { createMuiTheme } from "@material-ui/core/styles";
import AppBar from "./AppBar";
import Menu from "./Menu";
import { blue, purple } from "@material-ui/core/colors";
import CustomAppBar from "./AppBar";

const theme = createMuiTheme({
  palette: {
    type: "light",
    secondary: {
      main: blue[500],
    },
  },
});

// eslint-disable-next-line import/no-anonymous-default-export
const MyLayout = (props) => (
  <Layout {...props} appBar={CustomAppBar} menu={Menu} theme={theme} />
);

export default MyLayout;
