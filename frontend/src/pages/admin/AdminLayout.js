import { NavLink, Outlet, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Alert from "../../UI/Alert";

const navItems = [
  { to: "/admin", label: "Home", end: true },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/settings", label: "Settings" },
  { to: "/admin/audit", label: "Audit" },
];

const AdminLayout = () => {
  const user = useSelector((state) => state.user.currentUser);

  return (
    <div className="min-h-screen bg-[#f7f6f3] font-Heebo text-lightBlack">
      <Alert />
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-black/10 bg-[#1f1e1c] text-white lg:w-60 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-5 py-5 lg:block">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                Miini
              </p>
              <h1 className="mt-1 text-xl font-semibold">Admin</h1>
              {user?.name && (
                <p className="mt-1 truncate text-sm text-white/60">{user.name}</p>
              )}
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-white/70 underline-offset-2 hover:text-white hover:underline lg:mt-6"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
              Storefront
            </Link>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:overflow-visible">
            {navItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition lg:border-l-2 ${
                    isActive
                      ? "border-white bg-white/20 font-semibold text-white"
                      : "border-transparent text-white/65 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
