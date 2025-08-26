import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './AppRouter.module.scss';
import { getUser } from '../utilities/users-service';
import Navbar from "../components/Navbar/Navbar";

import AdminLoginPage from '../pages/Auth/AdminLoginPage/AdminLoginPage';
import AdminSignupPage from '../pages/Auth/AdminSignupPage/AdminSignupPage';
import UserAuthPage from '../pages/Auth/UserAuthPage/UserAuthPage';

import ProfilePage from '../pages/Profile/ProfilePage/ProfilePage';
import ItemsPage from '../pages/Items/ItemsPage/ItemsPage';
import ItemsEditPage from '../pages/Items/ItemsEditPage/ItemsEditPage';
import ItemsShowPage from '../pages/Items/ItemsShowPage/Items';
import ItemsCreatePage from '../pages/Items/ItemsCreate/ItemsCreate';
import OrdersPage from '../pages/Booking/OrdersPage/OrdersPage';
import CartPage from '../pages/Booking/CartPage/CartPage';
import StudentRequestsPage from '../pages/Booking/StudentRequestsPage/StudentRequestsPage';
import StockRequestPage from '../pages/Management/StockRequest/StockRequestPage';
import AnalyticsPage from '../pages/Analytics/AnalyticsPage/AnalyticsPage';

const AppRouter = () => {
  const [user, setUser] = useState(getUser());

  return (
    <Router>
      <main className={styles.App}>
        <Navbar user={user} setUser={setUser} />
        <Routes>
          {/* Routes for authentication pages */}
          {!user && (
            <>
              <Route path="/admin/login" element={<AdminLoginPage setUser={setUser} />} />
              <Route path="/admin" element={<AdminSignupPage setUser={setUser} />} />
              <Route path="/user" element={<UserAuthPage setUser={setUser} />} />
              <Route path="/*" element={<Navigate to="/user" />} />
            </>
          )}

          {/* Protected routes if user is logged in */}
          {user && user.role === 'admin' && (
            <>
              <Route path="/analytics" element={<AnalyticsPage user={user} setUser={setUser} />} />
              <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} /> 
              <Route path="/items" element={<ItemsPage user={user} setUser={setUser} />} />
              <Route path="/items/edit/:id" element={<ItemsEditPage user={user} setUser={setUser} />} />
              <Route path="/items/:id" element={<ItemsShowPage user={user} setUser={setUser} />} />
              <Route path="/items/create" element={<ItemsCreatePage user={user} setUser={setUser} />} />
              <Route path="/stock-request" element={<StockRequestPage user={user} setUser={setUser} />} />
              <Route path="/requests" element={<StudentRequestsPage user={user} setUser={setUser} />} />
              <Route path="/*" element={<Navigate to="/stock-request" />} />
            </>
          )}

          {user && user.role === 'user' && (
            <>
              <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
              <Route path="/items" element={<ItemsPage user={user} setUser={setUser} />} />
              <Route path="/items/:id" element={<ItemsShowPage user={user} setUser={setUser} />} />
              <Route path="/orders" element={<OrdersPage user={user} setUser={setUser} />} />
              <Route path="/cart" element={<CartPage user={user} setUser={setUser} />} />
              <Route path="/*" element={<Navigate to="/orders" />} />
            </>
          )}
        </Routes>
      </main>
    </Router>
  );
};

export default AppRouter;





