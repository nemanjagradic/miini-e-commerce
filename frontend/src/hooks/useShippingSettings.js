import { useEffect, useState } from "react";
import {
  DEFAULT_FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING,
  getTrustLine,
} from "../utils/shipping";

let cached = null;
let inflight = null;

const fetchPublicShippingSettings = async (apiUrl) => {
  if (cached) return cached;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const res = await fetch(`${apiUrl}/settings/public`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to load shipping settings");
      }
      cached = {
        freeShippingThreshold:
          data.data?.freeShippingThreshold ?? DEFAULT_FREE_SHIPPING_THRESHOLD,
        standardShipping: data.data?.standardShipping ?? STANDARD_SHIPPING,
      };
      return cached;
    } catch {
      return {
        freeShippingThreshold: DEFAULT_FREE_SHIPPING_THRESHOLD,
        standardShipping: STANDARD_SHIPPING,
      };
    } finally {
      inflight = null;
    }
  })();

  return inflight;
};

/** Clear cache after admin updates settings (optional). */
export const invalidateShippingSettingsCache = () => {
  cached = null;
};

const useShippingSettings = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(
    cached?.freeShippingThreshold ?? DEFAULT_FREE_SHIPPING_THRESHOLD
  );
  const [standardShipping, setStandardShipping] = useState(
    cached?.standardShipping ?? STANDARD_SHIPPING
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const settings = await fetchPublicShippingSettings(API_URL);
      if (cancelled) return;
      setFreeShippingThreshold(settings.freeShippingThreshold);
      setStandardShipping(settings.standardShipping);
    })();

    return () => {
      cancelled = true;
    };
  }, [API_URL]);

  return {
    freeShippingThreshold,
    standardShipping,
    trustLine: getTrustLine(freeShippingThreshold),
  };
};

export default useShippingSettings;
