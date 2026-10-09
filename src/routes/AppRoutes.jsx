import { Routes, Route } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Dashboard from '../pages/Dashboard'
import Menu from '../pages/Menu'
import Tables from '../pages/Tables'
import Orders from '../pages/Orders'
import Kitchen from '../pages/Kitchen'
import Billing from '../pages/Billing'
import Reservations from '../pages/Reservations'
import Staff from '../pages/Staff'
import NotFound from '../pages/NotFound'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="menu" element={<Menu />} />
        <Route path="tables" element={<Tables />} />
        <Route path="orders" element={<Orders />} />
        <Route path="kitchen" element={<Kitchen />} />
        <Route path="billing" element={<Billing />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="staff" element={<Staff />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}