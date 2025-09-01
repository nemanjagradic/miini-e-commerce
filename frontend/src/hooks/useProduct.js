import { useState, useEffect } from "react";

export function useProduct(productId) {
  const API_URL = process.env.REACT_APP_API_URL;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/products/${productId}`);
        const data = await res.json();
        setProduct(data.data);
      } catch (err) {
        console.error("Failed to fetch product", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, API_URL]);

  return { product, loading };
}
