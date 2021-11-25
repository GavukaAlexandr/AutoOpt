import React, { useEffect } from "react";
import "./App.less";
import { OrdersTable } from "./screens/Orders/OrdersTable";
import { UsersTable } from "./screens/Users/UsersTable";
import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./screens/LoginPage";
import { RequireAuth } from "./RequireAuth";
import { TypeTable } from "./screens/Types/TypeTable";
import { BrandTable } from "./screens/Brands/BrandTable";
import { ModelTable } from "./screens/Models/ModelTable";
import MainLayout from "./Layout";
declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

const App = () => {

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route element={<RequireAuth />}>
          <Route
            path="/"
            element={
              <OrdersTable
                page={0}
                perPage={50}
                sortField={"createdAt"}
                sortOrder={"desc"}
              />
            }
          />
          <Route
            path="/users"
            element={
              <UsersTable
                page={0}
                perPage={50}
                sortField={"firstName"}
                sortOrder={"desc"}
              />
            }
          />
          <Route
            path="/types"
            element={
              <TypeTable
                page={0}
                perPage={50}
                sortField={"name"}
                sortOrder={"asc"}
              />
            }
          />
          <Route
            path="/brands"
            element={
              <BrandTable
                page={0}
                perPage={50}
                sortField={"name"}
                sortOrder={"asc"}
              />
            }
          />
          <Route
            path="/models"
            element={
              <ModelTable
                page={0}
                perPage={50}
                sortField={"name"}
                sortOrder={"desc"}
              />
            }
          />
        </Route>
      </Route>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default App;
