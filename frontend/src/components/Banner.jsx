import React, { useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "react-avatar";
import { setBarOpen } from "../features/sidebar/sidebarSlice";
import { auth } from "../firebase/firebaseConfig";
import { setAuthUser } from "../features/auth/authSlice";
import { Link } from "react-router-dom";

const Banner = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(
          setAuthUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          })
        );
      } else {
        dispatch(setAuthUser(null));
      }
    });
    return () => unSubscribe();
  }, [dispatch]);

  return (
    <div className="bg-black/30 backdrop-blur-lg rounded-xl p-4 mx-4 my-6 shadow-[0_8px_32px_rgb(0_0_0/0.5)] relative animate-fadeIn">
      <div className="flex items-center">
        <div className="p-3 hover:bg-gray-700 hover:rounded-full rounded-full cursor-pointer transition-colors duration-300">
          <button onClick={() => dispatch(setBarOpen())}>
            <RxHamburgerMenu size={24} className="text-gray-300" />
          </button>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <h1 className="text-2xl text-gray-300 font-medium animate-glow absolute left-1/2 transform -translate-x-1/2">
            PG FINDER
          </h1>
        </div>

        <div className="flex items-center justify-end">
          {user ? (
            <>
              <div className="flex items-center gap-10 animate-slideFromRight">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden animate-pulse">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "User Avatar"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://tse3.mm.bing.net/th?id=OIP.btgP01toqugcXjPwAF-k2AHaHa&pid=Api&P=0&h=180";
                        }}
                      />
                    ) : (
                      <Avatar
                        src="https://tse3.mm.bing.net/th?id=OIP.btgP01toqugcXjPwAF-k2AHaHa&pid=Api&P=0&h=180"
                        size="40"
                        round={true}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <h3 className="text-gray-300 font-medium">
                    {user.displayName}
                  </h3>
                </div>
              </div>
              <div className="text-gray-300 hover:text-white transition-colors duration-300"></div>
            </>
          ) : (
            <div className="flex items-center gap-4 animate-slideFromRight text-xl">
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all duration-300 hover:shadow-[0_0_15px_rgba(37,99,235,0.5)]"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;