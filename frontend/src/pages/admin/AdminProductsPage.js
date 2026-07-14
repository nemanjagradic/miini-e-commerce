import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import {
  getCategoryName,
  getPrimaryImageUrl,
  resolveMediaUrl,
} from "../../utils/productImages";
import Spinner from "../../UI/Spinner";
import Modal from "../../UI/Modal";

const AdminProductsPage = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        includeDeleted: String(includeDeleted),
      });
      if (q.trim()) params.set("q", q.trim());

      const res = await fetch(`${API_URL}/products/admin/list?${params}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load products");
      setProducts(data.data || []);
      setPages(data.pages || 1);
    } catch (err) {
      dispatch(
        uiActions.setAlert({ status: "error", message: err.message, time: 4 })
      );
    } finally {
      setLoading(false);
    }
  }, [API_URL, dispatch, includeDeleted, page, q]);

  useEffect(() => {
    load();
  }, [load]);

  const softDelete = async (product) => {
    try {
      const res = await fetch(
        `${API_URL}/products/${product._id}/soft-delete`,
        { method: "PATCH", credentials: "include" }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed");
      dispatch(
        uiActions.setAlert({
          status: "success",
          message: "Product archived.",
          time: 3,
        })
      );
      load();
    } catch (err) {
      dispatch(
        uiActions.setAlert({ status: "error", message: err.message, time: 4 })
      );
    }
  };

  const restore = async (product) => {
    try {
      const res = await fetch(`${API_URL}/products/${product._id}/restore`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed");
      dispatch(
        uiActions.setAlert({
          status: "success",
          message: "Product restored.",
          time: 3,
        })
      );
      load();
    } catch (err) {
      dispatch(
        uiActions.setAlert({ status: "error", message: err.message, time: 4 })
      );
    }
  };

  const hardDelete = async (product) => {
    try {
      const res = await fetch(`${API_URL}/products/${product._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed");
      }
      dispatch(
        uiActions.setAlert({
          status: "success",
          message: "Product permanently deleted.",
          time: 3,
        })
      );
      load();
    } catch (err) {
      dispatch(
        uiActions.setAlert({ status: "error", message: err.message, time: 4 })
      );
    }
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    const { type, product } = confirmAction;
    setConfirmAction(null);
    if (type === "archive") await softDelete(product);
    if (type === "delete") await hardDelete(product);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Products</h2>
          <p className="mt-1 text-sm text-darker/60">
            Search, edit stock, images, and featured placement.
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="rounded-lg bg-lightBlack px-4 py-2 text-sm font-semibold text-white hover:bg-black"
        >
          New product
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            load();
          }}
          className="flex flex-1 flex-wrap gap-2"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title…"
            className="min-w-[200px] flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-lightBlack"
          />
          <button
            type="submit"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Search
          </button>
        </form>
        <label className="flex items-center gap-2 text-sm text-darker/70">
          <input
            type="checkbox"
            checked={includeDeleted}
            onChange={(e) => {
              setIncludeDeleted(e.target.checked);
              setPage(1);
            }}
          />
          Show archived
        </label>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-black/10 bg-white shadow-sm">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : products.length === 0 ? (
          <p className="py-12 text-center text-darker/50">No products found.</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-black/10 bg-[#faf9f7] text-xs uppercase tracking-wide text-darker/60">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const archived = Boolean(product.deletedAt);
                return (
                  <tr
                    key={product._id}
                    className={`border-b border-black/5 ${
                      archived ? "bg-red-50/40" : ""
                    }`}
                  >
                    <td className="max-w-[14rem] px-4 py-3 sm:max-w-xs">
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={resolveMediaUrl(getPrimaryImageUrl(product.imgs))}
                          alt=""
                          className="h-12 w-12 shrink-0 rounded object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-medium" title={product.title}>
                            {product.title}
                          </p>
                          {archived && (
                            <span className="text-xs font-medium text-red-700">
                              Archived
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getCategoryName(product.category) || "—"}
                    </td>
                    <td className="px-4 py-3">${product.price}</td>
                    <td className="px-4 py-3">{product.stockQuantity}</td>
                    <td className="px-4 py-3 text-xs">
                      {product.featuredPlacement || "—"}
                    </td>
                    <td className="space-x-2 whitespace-nowrap px-4 py-3 text-right">
                      <Link
                        to={`/admin/products/${product._id}`}
                        className="font-medium text-blue-700 hover:underline"
                      >
                        Edit
                      </Link>
                      {archived ? (
                        <button
                          type="button"
                          onClick={() => restore(product)}
                          className="font-medium text-emerald-700 hover:underline"
                        >
                          Restore
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setConfirmAction({ type: "archive", product })
                          }
                          className="font-medium text-amber-700 hover:underline"
                        >
                          Archive
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmAction({ type: "delete", product })
                        }
                        className="font-medium text-red-700 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-darker/60">
            Page {page} of {pages}
          </span>
          <button
            type="button"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {confirmAction?.type === "archive" && (
        <Modal
          message={`Archive "${confirmAction.product.title}"?`}
          description="It will be hidden from the storefront. You can restore it later."
          cancelMessage="Cancel"
          confirmMessage="Archive"
          confirmVariant="neutral"
          handleCancel={() => setConfirmAction(null)}
          handleConfirm={handleConfirm}
        />
      )}

      {confirmAction?.type === "delete" && (
        <Modal
          message={`Permanently delete "${confirmAction.product.title}"?`}
          description="Only allowed if this product was never ordered. This cannot be undone."
          cancelOrder
          cancelMessage="Cancel"
          confirmMessage="Delete"
          handleCancel={() => setConfirmAction(null)}
          handleConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

export default AdminProductsPage;
