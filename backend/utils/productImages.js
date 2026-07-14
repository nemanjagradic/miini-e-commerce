const normalizeImageEntries = (imgs = []) => {
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

const getPrimaryImageUrl = (imgs) => {
  const entries = normalizeImageEntries(imgs);
  if (!entries.length) return null;
  const primary = entries.find((img) => img.isPrimary);
  return (primary || entries[0]).url;
};

const getImageUrls = (imgs) => normalizeImageEntries(imgs).map((img) => img.url);

module.exports = {
  normalizeImageEntries,
  getPrimaryImageUrl,
  getImageUrls,
};
