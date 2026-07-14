import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { uiActions } from "../../store/ui-slice";
import {
  normalizeImageEntries,
  resolveMediaUrl,
} from "../../utils/productImages";
import Spinner from "../../UI/Spinner";

const emptyForm = {
  title: "",
  slug: "",
  price: "",
  stockQuantity: "",
  description: "",
  category: "",
  dimensions: "",
  weight: "",
  size: "",
  featuredPlacement: "",
};

const slugifyClient = (text) =>
  String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const AdminProductFormPage = () => {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [imgs, setImgs] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/categories`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!cancelled && res.ok) setCategories(data.data || []);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [API_URL]);

  useEffect(() => {
    if (isNew) return undefined;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/products/admin/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Product not found");
        if (cancelled) return;
        const p = data.data;
        setForm({
          title: p.title || "",
          slug: p.slug || "",
          price: p.price ?? "",
          stockQuantity: p.stockQuantity ?? "",
          description: p.description || "",
          category: p.category?._id || "",
          dimensions: p.dimensions || "",
          weight: p.weight || "",
          size: p.size || "",
          featuredPlacement: p.featuredPlacement || "",
        });
        setImgs(normalizeImageEntries(p.imgs));
        setSlugTouched(true);
      } catch (err) {
        dispatch(
          uiActions.setAlert({ status: "error", message: err.message, time: 4 })
        );
        navigate("/admin/products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [API_URL, dispatch, id, isNew, navigate]);

  const previewFiles = useMemo(
    () => newFiles.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [newFiles]
  );

  useEffect(() => {
    return () => {
      previewFiles.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previewFiles]);

  const totalImages = imgs.length + newFiles.length;

  const setField = (key, value) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "title" && !slugTouched) {
        next.slug = slugifyClient(value);
      }
      return next;
    });
  };

  const moveImg = (index, dir) => {
    setImgs((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((img, i) => ({ ...img, sortOrder: i }));
    });
  };

  const setPrimary = (index) => {
    setImgs((prev) =>
      prev.map((img, i) => ({ ...img, isPrimary: i === index }))
    );
  };

  const removeImg = (index) => {
    setImgs((prev) => {
      const next = prev.filter((_, i) => i !== index).map((img, i) => ({
        ...img,
        sortOrder: i,
      }));
      if (next.length && !next.some((img) => img.isPrimary)) {
        next[0].isPrimary = true;
      }
      return next;
    });
  };

  const onFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const room = 5 - imgs.length - newFiles.length;
    if (room <= 0) {
      dispatch(
        uiActions.setAlert({
          status: "error",
          message: "Maximum 5 images per product.",
          time: 3,
        })
      );
      return;
    }
    setNewFiles((prev) => [...prev, ...files.slice(0, room)]);
    e.target.value = "";
  };

  const save = async (e) => {
    e.preventDefault();
    if (totalImages < 1) {
      dispatch(
        uiActions.setAlert({
          status: "error",
          message: "Add at least one image.",
          time: 3,
        })
      );
      return;
    }

    setSaving(true);
    try {
      const body = new FormData();
      body.append("title", form.title);
      body.append("slug", form.slug || slugifyClient(form.title));
      body.append("price", String(form.price));
      body.append("stockQuantity", String(form.stockQuantity));
      body.append("description", form.description);
      body.append("category", form.category);
      if (form.dimensions) body.append("dimensions", form.dimensions);
      if (form.weight) body.append("weight", form.weight);
      if (form.size) body.append("size", form.size);
      body.append("featuredPlacement", form.featuredPlacement || "null");
      body.append("imgs", JSON.stringify(imgs));
      newFiles.forEach((file) => body.append("images", file));

      const url = isNew
        ? `${API_URL}/products`
        : `${API_URL}/products/${id}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        credentials: "include",
        body,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Save failed");

      dispatch(
        uiActions.setAlert({
          status: "success",
          message: isNew ? "Product created." : "Product updated.",
          time: 3,
        })
      );
      navigate("/admin/products");
    } catch (err) {
      dispatch(
        uiActions.setAlert({ status: "error", message: err.message, time: 4 })
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 text-sm text-darker/60 hover:text-lightBlack"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            Products
          </Link>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight">
            {isNew ? "New product" : "Edit product"}
          </h2>
        </div>
      </div>

      <form
        onSubmit={save}
        className="space-y-6 rounded-xl border border-black/10 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">Title</span>
            <input
              required
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-lightBlack"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Slug</span>
            <input
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setField("slug", e.target.value);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-lightBlack"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Category</span>
            <select
              required
              value={form.category}
              onChange={(e) => setField("category", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-lightBlack"
            >
              <option value="">Select…</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Price</span>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setField("price", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-lightBlack"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Stock</span>
            <input
              required
              type="number"
              min="0"
              value={form.stockQuantity}
              onChange={(e) => setField("stockQuantity", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-lightBlack"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Featured placement</span>
            <select
              value={form.featuredPlacement}
              onChange={(e) => setField("featuredPlacement", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-lightBlack"
            >
              <option value="">None</option>
              <option value="bestSeller">Best seller</option>
              <option value="trending">Trending</option>
              <option value="both">Both</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Size</span>
            <select
              value={form.size}
              onChange={(e) => setField("size", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-lightBlack"
            >
              <option value="">—</option>
              <option value="S">S</option>
              <option value="M">M</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Weight</span>
            <input
              value={form.weight}
              onChange={(e) => setField("weight", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-lightBlack"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Dimensions</span>
            <input
              value={form.dimensions}
              onChange={(e) => setField("dimensions", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-lightBlack"
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">Description</span>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-lightBlack"
            />
          </label>
        </div>

        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold">Images ({totalImages}/5)</h3>
            <label className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50">
              Upload
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onFiles}
                disabled={totalImages >= 5}
              />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {imgs.map((img, index) => (
              <div
                key={`${img.url}-${index}`}
                className="rounded-lg border border-black/10 p-2"
              >
                <img
                  src={resolveMediaUrl(img.url)}
                  alt=""
                  className="h-36 w-full rounded object-cover"
                />
                <div className="mt-2 flex flex-wrap gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => moveImg(index, -1)}
                    className="rounded border px-2 py-1"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImg(index, 1)}
                    className="rounded border px-2 py-1"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrimary(index)}
                    className={`rounded border px-2 py-1 ${
                      img.isPrimary ? "bg-lightBlack text-white" : ""
                    }`}
                  >
                    {img.isPrimary ? "Primary" : "Set primary"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImg(index)}
                    className="rounded border border-red-200 px-2 py-1 text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {previewFiles.map((p, index) => (
              <div
                key={p.url}
                className="rounded-lg border border-dashed border-black/20 p-2"
              >
                <img
                  src={p.url}
                  alt=""
                  className="h-36 w-full rounded object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setNewFiles((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="mt-2 rounded border border-red-200 px-2 py-1 text-xs text-red-700"
                >
                  Remove upload
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-lightBlack px-5 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save product"}
          </button>
          <Link
            to="/admin/products"
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AdminProductFormPage;
