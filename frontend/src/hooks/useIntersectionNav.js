import { useEffect } from "react";

const useScrollNav = (percentage = 0.4) => {
  useEffect(() => {
    const nav = document.querySelector(".navigation");
    if (!nav) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const triggerPoint =
        (document.body.scrollHeight - window.innerHeight) * percentage;

      if (scrollPos >= triggerPoint) {
        nav.classList.add("sticky");
      } else {
        nav.classList.remove("sticky");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [percentage]);
};

export default useScrollNav;
