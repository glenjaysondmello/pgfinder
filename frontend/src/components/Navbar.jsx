import React, { useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { clearAuthUser, setAuthUser } from "../features/auth/authSlice";
import Avatar from "react-avatar";
import { setBarOpen, setCloseBar } from "../features/sidebar/sidebarSlice";
import { clearCart } from "../features/pgslice/pgSlice";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(clearCart());
        dispatch(clearAuthUser());
        console.log("Sign Out");
        toast.success("Logged Out Successfully");
        navigate("/");
        dispatch(setCloseBar());
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
      });
  };

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 animate-slideFromLeft">
          <div className="p-3 hover:bg-gray-700 hover:rounded-full rounded-full cursor-pointer transition-colors duration-300">
            <button onClick={() => dispatch(setBarOpen())}>
              <RxHamburgerMenu size={24} className="text-gray-300" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden animate-pulse">
              <img
                src="https://tse3.mm.bing.net/th?id=OIP.VB187cXwkH66uPWT3X34JQHaHa&pid=Api&P=0&h=180"
                alt="logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl text-gray-300 font-medium animate-glow">
              PG-Finder
            </h1>
          </div>
        </div>

        <div className="flex items-center pl-24 gap-14 animate-slideFromTop ">
          <h2 className="text-gray-300 hover:text-gray-100 font-medium text-2xl transition-colors duration-300">
            <a href="/">Home</a>
          </h2>
          <h2 className="text-gray-300 hover:text-gray-100 font-medium text-2xl transition-colors duration-300">
            <a href="#about">About</a>
          </h2>
          <h2 className="text-gray-300 hover:text-gray-100 font-medium text-2xl transition-colors duration-300">
            <a href="#contact">Contact</a>
          </h2>
        </div>

        <div className="flex items-center justify-end w-[300px]">
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
                <button
                  onClick={logOut}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4 animate-slideFromRight">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all duration-300 hover:shadow-[0_0_15px_rgba(37,99,235,0.5)]"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
