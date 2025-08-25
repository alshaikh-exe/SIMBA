import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './AppRouter.module.scss';
import { getUser } from '../utilities/users-service';
import Navbar from "../components/Navbar/Navbar";

//Auth Pages
import AdminLoginPage from '../pages/Auth/AdminLoginPage/AdminLoginPage';
import AdminSignupPage from '../pages/Auth/AdminSignupPage/AdminSignupPage';
import UserAuthPage from '../pages/Auth/UserAuthPage/UserAuthPage';

//User Pages
import AnalyticsPage from '../pages/Analytics/AnalyticsPage/AnalyticsPage';
import ProfilePage from '../pages/Profile/ProfilePage/ProfilePage';
import ItemsPage from '../pages/Items/ItemsPage/ItemsPage';
import ItemsEditPage from '../pages/Items/ItemsEditPage/ItemsEditPage';
import ItemsShowPage from '../pages/Items/ItemsShowPage/Items';
import OrdersPage from '../pages/Booking/OrdersPage/OrdersPage';
import CartPage from '../pages/Booking/CartPage/CartPage';
import StudentRequestsPage from '../pages/Booking/StudentRequestsPage/StudentRequestsPage';

//Admin Page
import StockRequestPage from '../pages/Management/StockRequest/StockRequestPage';

const AppRouter = () => {
  const [user, setUser] = useState(getUser());

  return (
    <Router>
      <main className={styles.App}>
        <Navbar user={user} setUser={setUser}/>
        <Routes>
          {/* Routes for authentication pages */}
          {!user && (
            <>
              <Route path="/admin/login" element={<AdminLoginPage setUser={setUser} />}/>
              <Route path="/admin" element={<AdminSignupPage setUser={setUser} />}/>
              <Route path="/user" element={<UserAuthPage setUser={setUser} />}/>
              <Route path="/*" element={<Navigate to="/user" />} />
            </>
          )}

          {/* Protected routes if user is logged in */}
          {user && user.role === 'admin' && (
            <>
              <Route path="/analytics" element={<AnalyticsPage user={user} setUser={setUser} />} />
              <Route path="/profile" element={<ProfilePage user={user} />} /> /* Modified */
              <Route path="/stock-request" element={<StockRequestPage user={user} setUser={setUser}/>} />
              <Route path="/*" element={<Navigate to="/stock-request" />} />
            </>
          )}

          {user && user.role === 'user' && (
            <>
              <Route path="/analytics" element={<AnalyticsPage user={user} setUser={setUser}/>} />
              <Route path="/profile" element={<ProfilePage user={user}/>} />
              <Route path="/items" element={<ItemsPage user={user}/>} />
              <Route path="/items/edit/:id" element={<ItemsEditPage />} />
              <Route path="/items/:id" element={<ItemsShowPage />} />
              <Route path="/orders" element={<OrdersPage user={user} setUser={setUser}/>} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/requests" element={<StudentRequestsPage />} />
              <Route path="/*" element={<Navigate to="/orders" />} />
            </>
          )}
        </Routes>
      </main>
    </Router>
  );
};

export default AppRouter;






