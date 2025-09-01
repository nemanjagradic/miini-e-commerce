import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { productsActions } from "../../store/products-slice";

export function useFetchProducts() {
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(productsActions.setLoading(true));
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();

        dispatch(productsActions.setProducts(data.data));
      } catch (err) {
        dispatch(productsActions.setError("Failed to load products"));
      } finally {
        dispatch(productsActions.setLoading(false));
      }
    }
    fetchProducts();
  }, [dispatch, API_URL]);
}
