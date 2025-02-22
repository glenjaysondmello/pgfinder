import React from "react";
import { useForm } from "react-hook-form";
import { auth, googleProvider } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async ({ email, password }) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredentials);
      const loggedUser = userCredentials.user;
      const token = await loggedUser.getIdToken();
      console.log("Token:",token);

      dispatch(
        setAuthUser({
          user: {
            uid: loggedUser.uid,
            email: loggedUser.email,
            displayName: loggedUser.displayName,
          },
          token,
        })
      );
      toast.success("Logged In Successfully");
      navigate("/");
    } catch (error) {
      error.code === "auth/invalid-credential"
        ? toast.error("Incorrect Email or Password")
        : toast.error("An error occurred. Please try again.");
      console.log(error);
    }
  };

  const handleGoogleSignIn = async () => {
    googleProvider.setCustomParameters({
      prompt: "select_account",
    });
    try {
      const userCredentials = await signInWithPopup(auth, googleProvider);
      const loggedUser = userCredentials.user;
      const token = await loggedUser.getIdToken();

      dispatch(
        setAuthUser({
          user: {
            uid: loggedUser.uid,
            email: loggedUser.email,
            displayName: loggedUser.displayName,
            photoURL: loggedUser.photoURL,
          },
          token,
        })
      );
      toast.success("Signed In With Google");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Google Sign-In Failed");
    }
  };

  const inp_box_style =
    "w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition duration-200";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-purple-900 flex items-center justify-center p-4">
      <div className="dark-animated-container">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-white text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              className={inp_box_style}
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <span className="text-red-400 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-white text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              className={inp_box_style}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password && (
              <span className="text-red-400 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transform hover:scale-[1.02] transition-all duration-200"
          >
            Sign In
          </button>

          <p className="text-center text-white/80 mt-4">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-purple-400 hover:text-purple-300 font-medium transition duration-200"
            >
              Sign Up
            </Link>
          </p>
        </form>
        <div>
          <button
            onClick={handleGoogleSignIn}
            className="w-full mt-4 py-3 px-4 bg-white text-gray-800 font-medium flex items-center justify-center gap-2 rounded-lg shadow-lg shadow-gray-300 hover:shadow-md hover:shadow-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transform hover:scale-[1.02] transition-all duration-200"
          >
            <img src="../../google.png" alt="Google Logo" className="w-5 h-5" />
            <span>Sign In with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
