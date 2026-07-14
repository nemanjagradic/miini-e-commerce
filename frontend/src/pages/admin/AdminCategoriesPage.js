import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import { resolveMediaUrl } from "../../utils/productImages";
import Spinner from "../../UI/Spinner";
import Modal from "../../UI/Modal";

const emptyForm = {
  name: "",
  slug: "",
  sortOrder: 0,
  image: "",
};

const AdminCategoriesPage = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/categories`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load categories");
      setCategories(data.data || []);
    } catch (err) {
      dispatch(
        uiActions.setAlert({
          status: "error",
          message: err.message,
          time: 4,
        })
      );
    } finally {
      setLoading(false);
    }
  }, [API_URL, dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  const startCreate = () => {
    setEditingId("new");
    setForm(emptyForm);
    setImageFile(null);
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setForm({
      name: cat.name || "",
      slug: cat.slug || "",
      sortOrder: cat.sortOrder ?? 0,
      image: cat.image || "",
    });
    setImageFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isNew = editingId === "new";
      const url = isNew
        ? `${API_URL}/categories`
        : `${API_URL}/categories/${editingId}`;

      let res;
      if (!isNew && imageFile) {
        const body = new FormData();
        body.append("name", form.name);
        body.append("slug", form.slug);
        body.append("sortOrder", String(form.sortOrder));
        body.append("image", form.image || "");
        body.append("imageFile", imageFile);
        res = await fetch(url, {
          method: "PATCH",
          credentials: "include",
          body,
        });
      } else {
        res = await fetch(url, {
          method: isNew ? "POST" : "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            slug: form.slug || undefined,
            sortOrder: Number(form.sortOrder) || 0,
            image: form.image || null,
          }),
        });
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Save failed");

      dispatch(
        uiActions.setAlert({
          status: "success",
          message: isNew ? "Category created." : "Category updated.",
          time: 3,
        })
      );
      cancelEdit();
      await load();
    } catch (err) {
      dispatch(
        uiActions.setAlert({
          status: "error",
          message: err.message,
          time: 4,
        })
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (cat) => {
    try {
      const res = await fetch(`${API_URL}/categories/${cat._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Delete failed");
      dispatch(
        uiActions.setAlert({
          status: "success",
          message: "Category deleted.",
          time: 3,
        })
      );
      await load();
    } catch (err) {
      dispatch(
        uiActions.setAlert({
          status: "error",
          message: err.message,
          time: 4,
        })
      );
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Categories</h2>
          <p className="mt-1 text-sm text-darker/60">
            Controls storefront filters, footer links, and product assignment.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="rounded-lg bg-lightBlack px-4 py-2 text-sm font-semibold text-white hover:bg-black"
        >
          New category
        </button>
      </div>

      {editingId && (
        <form
          onSubmit={save}
          className="mt-6 space-y-4 rounded-xl border border-black/10 bg-white p-5 shadow-sm"
        >
          <h3 className="text-lg font-semibold">
            {editingId === "new" ? "Create category" : "Edit category"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Name</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-lightBlack"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Slug</span>
              <input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="auto from name"
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-lightBlack"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Sort order</span>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sortOrder: e.target.value }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-lightBlack"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Image path (optional)</span>
              <input
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                placeholder="images/hero-chairs.png"
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-lightBlack"
              />
            </label>
            {editingId !== "new" && (
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1 block font-medium">Or upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </label>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-lightBlack px-4 py-2 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-black/10 bg-white shadow-sm">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-black/10 bg-[#faf9f7] text-xs uppercase tracking-wide text-darker/60">
              <tr>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-b border-black/5">
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-darker/70">{cat.slug}</td>
                  <td className="px-4 py-3">{cat.sortOrder}</td>
                  <td className="px-4 py-3">
                    {cat.image ? (
                      <img
                        src={resolveMediaUrl(cat.image)}
                        alt=""
                        className="h-10 w-14 rounded object-cover"
                      />
                    ) : (
                      <span className="text-darker/40">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => startEdit(cat)}
                      className="mr-2 text-sm font-medium text-blue-700 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryToDelete(cat)}
                      className="text-sm font-medium text-red-700 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {categoryToDelete && (
        <Modal
          message={`Delete category "${categoryToDelete.name}"?`}
          description="Only allowed if no products still use this category."
          cancelOrder
          cancelMessage="Cancel"
          confirmMessage="Delete"
          handleCancel={() => setCategoryToDelete(null)}
          handleConfirm={async () => {
            const cat = categoryToDelete;
            setCategoryToDelete(null);
            await remove(cat);
          }}
        />
      )}
    </div>
  );
};

export default AdminCategoriesPage;
