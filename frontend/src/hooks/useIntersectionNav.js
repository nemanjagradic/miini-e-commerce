import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const useScrollNav = ({
  homeOffset = 80,
  defaultOffset = 200,
  scrollDelta = 8,
} = {}) => {
  const { pathname } = useLocation();
  const lastScrollY = useRef(0);

  useEffect(() => {
    const nav = document.querySelector(".navigation");
    if (!nav) return;

    const trigger = pathname === "/" ? homeOffset : defaultOffset;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollY.current;

      if (Math.abs(delta) < scrollDelta) return;

      if (scrollY <= trigger) {
        nav.classList.remove("sticky-hidden");
      } else if (delta > 0) {
        nav.classList.add("sticky-hidden");
      } else {
        nav.classList.remove("sticky-hidden");
      }

      lastScrollY.current = scrollY;
    };

    nav.classList.remove("sticky-hidden");
    lastScrollY.current = window.scrollY;

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, homeOffset, defaultOffset, scrollDelta]);
};

export default useScrollNav;
