import { useMemo, useEffect } from "react";

const useIntersectionNav = (options, targetEl, categoryPage = false) => {
  // nisam znao na koji drugi nacin da selektujem nav, pa sam uradio na ovaj nacin
  const nav = document.querySelector(".nav");

  const obsCallback = function (entries) {
    const [entry] = entries;

    if (categoryPage && entry.intersectionRect.y > 15) {
      nav.classList.remove("sticky");
    }
    if (categoryPage && entry.intersectionRect.y < 15) {
      nav.classList.add("sticky");
    }

    if (!categoryPage) {
      if (!entry.isIntersecting) {
        nav.classList.add("sticky");
      } else {
        nav.classList.remove("sticky");
      }
    }
  };

  const obsOptions = useMemo(() => {
    return options;
  }, [options]);

  useEffect(() => {
    const stickyNavObserver = new IntersectionObserver(obsCallback, obsOptions);
    const currentTarget = targetEl;
    if (currentTarget) stickyNavObserver.observe(currentTarget);

    return () => {
      if (currentTarget) stickyNavObserver.unobserve(currentTarget);
    };
  }, [targetEl, options]);
};

export default useIntersectionNav;
