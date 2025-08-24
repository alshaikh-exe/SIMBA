import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './AppRouter.module.scss';
import { getUser } from '../utilities/users-service';
import AdminLoginPage from '../pages/Auth/AdminLoginPage/AdminLoginPage';
import AdminSignupPage from '../pages/Auth/AdminSignupPage/AdminSignupPage';
import UserAuthPage from '../pages/Auth/UserAuthPage/UserAuthPage';
import MainPage from '../pages/MainPage/MainPage';

const AppRouter = () => {
  const [user, setUser] = useState(getUser());

  return (
    <Router>
      <main className={styles.App}>
        <Routes>
          {/* Routes for authentication pages */}
          {!user && (
            <>
              <Route
                path="/admin/login"
                element={<AdminLoginPage setUser={setUser} />}
              />
              <Route
                path="/admin"
                element={<AdminSignupPage setUser={setUser} />}
              />
              <Route
                path="/user"
                element={<UserAuthPage setUser={setUser} />}
              />
              {/* Redirect root to user auth page if not logged in */}
              <Route path="/main" element={<Navigate to="/user" />} />
            </>
          )}

          {/* Routes for logged-in users */}
          {user && (
            <>
              <Route
                path="/main"
                element={<MainPage user={user} setUser={setUser} />}
              />
              {/* Catch-all redirects to /main for logged-in users */}
              <Route path="/*" element={<Navigate to="/main" />} />
            </>
          )}
        </Routes>
      </main>
    </Router>
  );
};

export default AppRouter;
