const API_URL = process.env.REACT_APP_API_URL || "";
const ASSET_BASE = API_URL.replace(/\/api\/?$/, "");

export const normalizeImageEntries = (imgs = []) => {
  if (!Array.isArray(imgs)) return [];
  return imgs
    .map((img, index) => {
      if (typeof img === "string") {
        return { url: img, sortOrder: index, isPrimary: index === 0 };
      }
      return {
        url: img.url,
        sortOrder: img.sortOrder ?? index,
        isPrimary: Boolean(img.isPrimary),
      };
    })
    .filter((img) => img.url)
    .sort((a, b) => a.sortOrder - b.sortOrder);
};

export const getImageUrls = (imgs) =>
  normalizeImageEntries(imgs).map((img) => img.url);

export const getPrimaryImageUrl = (imgs) => {
  const entries = normalizeImageEntries(imgs);
  if (!entries.length) return null;
  const primary = entries.find((img) => img.isPrimary);
  return (primary || entries[0]).url;
};

/** Resolve a stored path/URL to a browser-usable src. */
export const resolveMediaUrl = (pathOrUrl) => {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl) || pathOrUrl.startsWith("blob:")) {
    return pathOrUrl;
  }
  const cleaned = pathOrUrl.replace(/^\//, "");
  if (
    cleaned.startsWith("images/products/") ||
    cleaned.startsWith("images/categories/") ||
    cleaned.startsWith("images/users/")
  ) {
    return `${ASSET_BASE}/${cleaned}`;
  }
  return `/${cleaned}`;
};

export const getCategorySlug = (category) => {
  if (!category) return "";
  if (typeof category === "string") return category;
  return category.slug || "";
};

export const getCategoryName = (category) => {
  if (!category) return "";
  if (typeof category === "string") {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
  return category.name || category.slug || "";
};
