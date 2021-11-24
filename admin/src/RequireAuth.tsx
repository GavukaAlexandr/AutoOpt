import React, { useEffect, useState } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

export function RequireAuth() {
  const phone = localStorage.getItem("phone");
  const password = localStorage.getItem("password");
  let location = useLocation();

  if (!phone && !password) {
    return <Navigate to="/login" state={{ from: location }} />;
  } else {
    return <Outlet />;
  }
}
