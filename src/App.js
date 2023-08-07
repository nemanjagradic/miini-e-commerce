import HomePage from "./pages/HomePage";
import SingleProductPage from "./pages/SingleProductPage";
import CategoriesPage from "./pages/CategoriesPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import ProductPage from "./pages/ProductPage";
import ErrorPage from "./pages/ErrorPage";

export const products = [
  {
    id: 1,
    imgs: ["images/chair-1.png", "images/chair-2.png", "images/chair-3.png"],
    title: "Kimme Chair",
    description:
      "Kyuzo is a capsule collection of desk aKyuzo is a capsule collection of desk and home accessories, driven by materiality and designed to provide divisions of space through subtle hierarchies.",
    weight: "1.5kg",
    dimensions: "700 x 500 x 800 cm",
    size: "M",
    price: 95,
    category: "chairs",
  },
  {
    id: 2,
    imgs: ["images/teacaddy-1.png", "images/teacaddy-2.png"],
    title: "Kimme Tea Caddy",
    description:
      "Kyuzo is a capsule collection of desk and home accessories, driven by materiality and designed to provide divisions of space through subtle hierarchies.",
    weight: "0.2 kg",
    dimensions: "35 x 50 x 40cm",
    price: 30,
    category: "other",
  },
  {
    id: 3,
    imgs: ["images/earphonecase-1.png", "images/earphonecase-2.png"],
    title: "Earphone Case",
    description:
      "Kyuzo is a capsule collection of desk and home accessories, driven by materiality and designed to provide divisions of space through subtle hierarchies.",
    weight: "0.2 kg",
    dimensions: "100 x 50 x 40 cm",
    price: 25,
    category: "other",
  },
  {
    id: 4,
    imgs: ["images/table-1.png", "images/table-2.png"],
    title: "Horrison Table",
    description:
      "Kyuzo is a capsule collection of desk and home accessories, driven by materiality and designed to provide divisions of space through subtle hierarchies.",
    weight: "	1.5 kg",
    dimensions: "35 x 200 x 230 cm",
    price: 350,
    category: "tables",
  },
  {
    id: 5,
    imgs: ["images/clock-1.jpg"],
    title: "Wallnut Wall Clock",
    description:
      "Kyuzo is a capsule collection of desk and home accessories, driven by materiality and designed to provide divisions of space through subtle hierarchies.",
    weight: "	0.2 kg",
    dimensions: "700 x 200 x 800 cm",
    price: 35,
    category: "clocks",
  },
  {
    id: 6,
    imgs: ["images/roundtable-1.png"],
    title: "Arper Round Table",
    description:
      "Kyuzo is a capsule collection of desk and home accessories, driven by materiality and designed to provide divisions of space through subtle hierarchies.",
    weight: "1.7 kg",
    dimensions: "700 x 20 x 230 cm",
    price: 200,
    category: "tables",
  },
  {
    id: 7,
    imgs: ["images/yamanami chair-1.png"],
    title: "Yamanami Chair",
    description:
      "Kyuzo is a capsule collection of desk and home accessories, driven by materiality and designed to provide divisions of space through subtle hierarchies.",
    weight: "	2.5 kg",
    dimensions: "1530 x 800 x 1250 cm",
    price: 200,
    category: "chairs",
  },
  {
    id: 8,
    imgs: ["images/vase-1.jpg", "images/vase-2.jpg"],
    title: "Concrete Vase",
    description:
      "Donec accumsan auctor iaculis. Sed suscipit arcu ligula, at egestas magna molestie a. Proin ac ex maximus, ultrices justo eget, sodales orci.",
    weight: "0.2 kg",
    dimensions: "35 x 50 x 20 cm",
    price: 120,
    category: "other",
  },
  {
    id: 9,
    imgs: ["images/oak-chair-1.jpg", "images/oak-chair-2.jpg"],
    title: "Oak Wooden Chair",
    description:
      "Donec accumsan auctor iaculis. Sed suscipit arcu ligula, at egestas magna molestie a. Proin ac ex maximus, ultrices justo eget, sodales orci.",
    weight: "1.5kg",
    dimensions: "700 x 500 x 800 cm",
    size: "S",
    price: 60,
    category: "chairs",
  },
  {
    id: 10,
    imgs: ["images/takata-clock-1.png"],
    title: "Takata lemnos clock",
    description:
      "Kyuzo is a capsule collection of desk and home accessories, driven by materiality and designed to provide divisions of space through subtle hierarchies.",
    weight: "	0.4 kg",
    dimensions: "	50 x 60 x 30 cm",
    price: 50,
    category: "clocks",
  },
  {
    id: 11,
    imgs: ["images/ottoman-chair-1.png"],
    title: "Ottoman Chair",
    description:
      "Kyuzo is a capsule collection of desk and home accessories, driven by materiality and designed to provide divisions of space through subtle hierarchies.",
    weight: "1.8 kg",
    dimensions: "700 x 500 x 20 cm",
    price: 80,
    category: "chairs",
  },
  {
    id: 12,
    imgs: ["images/task-pendant-black-1.jpg"],
    title: "Task Pendant Black",
    description:
      "Donec accumsan auctor iaculis. Sed suscipit arcu ligula, at egestas magna molestie a. Proin ac ex maximus, ultrices justo eget, sodales orci.",
    weight: "0.8 kg",
    dimensions: "35 x 50 x 40 cm",
    price: 110,
    category: "lamps",
  },
  {
    id: 13,
    imgs: ["images/task-pendant-gold-1.jpg"],
    title: "Task Pendant Gold",
    description:
      "Donec accumsan auctor iaculis. Sed suscipit arcu ligula, at egestas magna molestie a. Proin ac ex maximus, ultrices justo eget, sodales orci.",
    weight: "0.8 kg",
    dimensions: "35 x 50 x 40 cm",
    price: 110,
    category: "lamps",
  },
  {
    id: 14,
    imgs: ["images/task-pendant-grey-1.jpg"],
    title: "Task Pendant Grey",
    description:
      "Donec accumsan auctor iaculis. Sed suscipit arcu ligula, at egestas magna molestie a. Proin ac ex maximus, ultrices justo eget, sodales orci.",
    weight: "0.8 kg",
    dimensions: "35 x 50 x 40 cm",
    price: 110,
    category: "lamps",
  },
];

const router = createBrowserRouter([
  {
    path: "",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "products/:productId",
        element: <SingleProductPage />,
      },
      { path: "categories/:categoryName", element: <CategoriesPage /> },
      { path: "product-page", element: <ProductPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
