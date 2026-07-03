import HomePage from "./pages/HomePage";
import SingleProductPage from "./pages/SingleProductPage";
import CategoriesPage from "./pages/CategoriesPage";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import StoreLayout from "./pages/StoreLayout";
import RequireAuth from "./pages/RequireAuth";
import ProductPage from "./pages/ProductPage";
import ErrorPage from "./pages/ErrorPage";
import CheckoutPage from "./pages/CheckoutPage";
import AuthPage from "./pages/AuthPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UserProfilePage from "./pages/UserProfilePage";
import ProfileSettings from "./components/Layout/Profile/ProfileSettings";
import OrderHistory from "./components/Layout/Profile/OrderHistory";
import Favorites from "./components/Layout/Profile/Favorites";

const router = createBrowserRouter([
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
      { path: "product-page", element: <ProductPage /> },
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
