import HomePage from "./pages/HomePage";
import SingleProductPage from "./pages/SingleProductPage";
import CategoriesPage from "./pages/CategoriesPage";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import StoreLayout from "./pages/StoreLayout";
import RequireAuth from "./pages/RequireAuth";
import ErrorPage from "./pages/ErrorPage";
import CheckoutPage from "./pages/CheckoutPage";
import AuthPage from "./pages/AuthPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UserProfilePage from "./pages/UserProfilePage";
import ProfileSettings from "./components/Layout/Profile/ProfileSettings";
import OrderHistory from "./components/Layout/Profile/OrderHistory";
import Favorites from "./components/Layout/Profile/Favorites";
import AdminAuthBootstrap from "./pages/admin/AdminAuthBootstrap";
import RequireAdmin from "./pages/admin/RequireAdmin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminHomePage from "./pages/admin/AdminHomePage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminProductFormPage from "./pages/admin/AdminProductFormPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminOrderDetailPage from "./pages/admin/AdminOrderDetailPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminAuditPage from "./pages/admin/AdminAuditPage";

const router = createBrowserRouter([
  {
    path: "/admin",
    element: <AdminAuthBootstrap />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <RequireAdmin />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminHomePage /> },
              { path: "orders", element: <AdminOrdersPage /> },
              { path: "orders/:id", element: <AdminOrderDetailPage /> },
              { path: "products", element: <AdminProductsPage /> },
              { path: "products/new", element: <AdminProductFormPage /> },
              { path: "products/:id", element: <AdminProductFormPage /> },
              { path: "categories", element: <AdminCategoriesPage /> },
              { path: "users", element: <AdminUsersPage /> },
              { path: "settings", element: <AdminSettingsPage /> },
              { path: "audit", element: <AdminAuditPage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <StoreLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "home", element: <Navigate to="/" replace /> },
      { path: "auth", element: <AuthPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password/:token", element: <ResetPasswordPage /> },
      { path: "products/:slug", element: <SingleProductPage /> },
      { path: "categories/:categoryName", element: <CategoriesPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      {
        element: <RequireAuth />,
        children: [
          {
            path: "profile",
            element: <UserProfilePage />,
            children: [
              { index: true, element: <ProfileSettings /> },
              { path: "orders", element: <OrderHistory /> },
              { path: "favorites", element: <Favorites /> },
            ],
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
