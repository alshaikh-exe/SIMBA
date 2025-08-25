import AnalyticsPage from '../pages/Analytics/AnalyticsPage/AnalyticsPage';
import ProfilePage from '../pages/Profile/ProfilePage/ProfilePage';
// User Pages
import ItemsPage from '../pages/Items/ItemsPage/ItemsPage';
import ItemsEditPage from '../pages/Items/ItemsEditPage/ItemsEditPage';
import ItemsShowPage from '../pages/Items/ItemsShowPage/Items';
import OrdersPage from '../pages/Booking/OrdersPage/OrdersPage';
import CartPage from '../pages/Booking/CartPage/CartPage';
import StudentRequestsPage from '../pages/Booking/StudentRequestsPage/StudentRequestsPage';
// Admin Pages
import StockRequestPage from '../pages/Management/StockRequest/StockRequestPage';
export const adminRoutes = [
  { path: '/analytics', element: <AnalyticsPage /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/stock-request', element: <StockRequestPage /> },
];
export const userRoutes = [
  { path: '/analytics', element: <AnalyticsPage /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/items', element: <ItemsPage /> },
  { path: '/items/edit/:id', element: <ItemsEditPage /> },
  { path: '/items/:id', element: <ItemsShowPage /> },
  { path: '/orders', element: <OrdersPage /> },
  { path: '/cart', element: <CartPage /> },
  { path: '/requests', element: <StudentRequestsPage /> },
];



