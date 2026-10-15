import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import Dashboard from "../pages/Dashboard";
import Menu from "../pages/Menu";
import Tables from "../pages/Tables";
import Orders from "../pages/Orders";
import Kitchen from "../pages/Kitchen";
import Billing from "../pages/Billing";
import Reservations from "../pages/Reservations";
import Staff from "../pages/Staff";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";

import { ROLES } from "../utils/constants";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected — wrapped in Layout + auth check */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="menu" element={<Menu />} />
        <Route path="tables" element={<Tables />} />
        <Route path="orders" element={<Orders />} />

        <Route
          path="kitchen"
          element={
            <RoleRoute roles={[ROLES.ADMIN, ROLES.CHEF]}>
              <Kitchen />
            </RoleRoute>
          }
        />
        <Route
          path="billing"
          element={
            <RoleRoute roles={[ROLES.ADMIN, ROLES.WAITER]}>
              <Billing />
            </RoleRoute>
          }
        />
        <Route
          path="reservations"
          element={
            <RoleRoute roles={[ROLES.ADMIN, ROLES.WAITER]}>
              <Reservations />
            </RoleRoute>
          }
        />
        <Route
          path="staff"
          element={
            <RoleRoute roles={[ROLES.ADMIN]}>
              <Staff />
            </RoleRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
