import React from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import AppLayout from "./layouts/UnAuthLayout";
import Login from "./pages/Authentication/Login";
import Employees from "./pages/Employees";
import DashboardLayout from "./layouts/DashboardLayout";
import Logout from "./pages/Authentication/Logout";
import Signup from "./pages/Authentication/Signup";
import Report from "./pages/Employees/Report";
import Cart from "./pages/Employees/Cart";

function Routing() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={
            <AppLayout>
              <Login />
            </AppLayout>
          }
        /> 

<Route
          path="/report"
          element={
            <DashboardLayout>
              <Report />
            </DashboardLayout>
          }
        /> 

<Route
          path="/cart"
          element={
            <DashboardLayout>
              <Cart />
            </DashboardLayout>
          }
        /> 

<Route
          path="/signup"
          element={
            <AppLayout>
              <Signup/>
            </AppLayout>
          }
        /> 

<Route
          path="/signout"
          element={
              <Logout />
          }
        />
<Route
          path="/"
          element={
            <DashboardLayout>
              <Employees />
            </DashboardLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default Routing;
