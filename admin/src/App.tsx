import React, { useEffect, useState } from "react";
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
import { ApolloClient, ApolloLink, ApolloProvider, from, HttpLink, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { useNavigate } from "react-router-dom";
import LocalizedStrings from "react-localization";
const httpLink = new HttpLink({ uri: 'http://192.168.88.30:3000/graphql' });
declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

const App = () => {
  const [localization, setLocalization] = useState<Record<string, any>>();

  useEffect(() => {
    (async function loadTranslations() {
      const response = await fetch('http://localhost:3000/public/app-localizations/ru_RU.json');
      const result = await response.json();
      setLocalization(result);
    })();

  }, [])
  const translations = new LocalizedStrings({
    ru: {
      ...localization
    }
  });

  translations.setLanguage('ru')

  let navigate = useNavigate();

  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        Authorization: localStorage.getItem('token') || null
      }
    }));
  
    return forward(operation);
  })
  
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) => {
        if (message === "Unauthorized") {
          localStorage.removeItem('token');
          return navigate("/login");
        }
        return null
      });
    }
  });
  
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: from([
      authMiddleware,
      errorLink,
      httpLink
    ]),
  });

  return (
    <ApolloProvider client={client}>
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
                translations={translations}
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
                translations={translations}
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
    </ApolloProvider>
  );
};

export default App;
