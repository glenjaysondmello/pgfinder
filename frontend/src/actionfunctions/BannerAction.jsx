import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLastScrollY, setShowBanner } from "../features/scroll/scrollSlice";
import Banner from "../components/Banner";

const BannerAction = () => {
  const dispatch = useDispatch();
  const { showBanner } = useSelector((store) => store.scroll);
  const { lastScrollY } = useSelector((store) => store.scroll);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        dispatch(setShowBanner(false));
      } else {
        dispatch(setShowBanner(true));
      }

      dispatch(setLastScrollY(currentScrollY));
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dispatch, lastScrollY]);
  return (
    <div>
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
          showBanner ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Banner />
      </div>
    </div>
  );
};

export default BannerAction;
