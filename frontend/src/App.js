import HomePage from "./pages/HomePage";
import SingleProductPage from "./pages/SingleProductPage";
import CategoriesPage from "./pages/CategoriesPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedLayout from "./pages/ProtectedLayout";
import PublicLayout from "./pages/PublicLayout";
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
    element: <PublicLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <AuthPage /> },
      { path: "auth", element: <AuthPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password/:token", element: <ResetPasswordPage /> },
    ],
  },
  {
    path: "/",
    element: <ProtectedLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "home", element: <HomePage /> },
      {
        path: "profile",
        element: <UserProfilePage />,
        children: [
          { index: true, element: <ProfileSettings /> },
          { path: "orders", element: <OrderHistory /> },
          { path: "favorites", element: <Favorites /> },
        ],
      },
      { path: "products/:productId", element: <SingleProductPage /> },
      { path: "categories/:categoryName", element: <CategoriesPage /> },
      { path: "product-page", element: <ProductPage /> },
      { path: "checkout", element: <CheckoutPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
