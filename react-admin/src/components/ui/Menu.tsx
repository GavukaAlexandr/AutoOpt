import * as React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import { MenuProps, ReduxState, MenuItemLink } from "react-admin";

import OrderIcon from "@material-ui/icons/ShoppingCartRounded";
import BrandIcon from "@material-ui/icons/LocalOfferRounded";
import CarIcon from "@material-ui/icons/DirectionsCarRounded";
import ModelIcon from "@material-ui/icons/ViewListRounded";
import UserIcon from "@material-ui/icons/PersonRounded";


const Menu = ({ dense = false }: MenuProps) => {

  const open = useSelector((state: ReduxState) => state.admin.ui.sidebarOpen);
  const classes = useStyles();

  return (
    <div
      className={classnames(classes.root, {
        [classes.open]: open,
        [classes.closed]: !open,
      })}
    >
      {/*
        // @ts-ignore */}
      <MenuItemLink
        to={{
          pathname: "/User",
          state: { _scrollToTop: true },
        }}
        primaryText="Users"
        leftIcon={<UserIcon />}
        dense={dense}
      />
      {/*
        // @ts-ignore */}
      <MenuItemLink
        to={{
          pathname: "/Order",
          state: { _scrollToTop: true },
        }}
        primaryText="Orders"
        leftIcon={<OrderIcon />}
        dense={dense}
      />
        {/*
        // @ts-ignore */}
        <MenuItemLink
          to={{
            pathname: "/Type",
            state: { _scrollToTop: true },
          }}
          primaryText="Type"
          leftIcon={<CarIcon />}
          dense={dense}
        />
        {/*
        // @ts-ignore */}
        <MenuItemLink
          to={{
            pathname: "/Brand",
            state: { _scrollToTop: true },
          }}
          primaryText="Brand"
          leftIcon={<BrandIcon />}
          dense={dense}
        />
        {/*
        // @ts-ignore */}
        <MenuItemLink
          to={{
            pathname: "/Model",
            state: { _scrollToTop: true },
          }}
          primaryText="Model"
          leftIcon={<ModelIcon />}
          dense={dense}
        />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    // marginBottom: theme.spacing(1),
    // transition: theme.transitions.create("width", {
    // easing: theme.transitions.easing.sharp,
    // duration: theme.transitions.duration.leavingScreen,
    // }),
  },
  open: {
    width: 200,
  },
  closed: {
    width: 55,
  },
}));

export default Menu;
