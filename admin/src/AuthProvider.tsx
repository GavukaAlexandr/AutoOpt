import React, { useEffect, useState } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

export function RequireAuth({ changeAuth }: any) {
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");
  let location = useLocation();

  if (!email && !password) {
    changeAuth(false);
    return <Navigate to="/login" state={{ from: location }} />;
  } else {
    changeAuth(true);
    return <Outlet />;
  }
}
