import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { auth, googleProvider } from "../firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";
import { setAuthUser, setCurrentUser } from "../features/auth/authSlice";
import { FaExclamationCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const onSubmit = async ({ name, email, password }) => {
    setIsLoading(true);
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const registeredUser = userCredentials.user;

      await sendEmailVerification(registeredUser);
      toast.success("Verification email sent! Please check your inbox.");

      await updateProfile(registeredUser, { displayName: name });

      const token = await registeredUser.getIdToken();

      const { data } = await axios.get(
        `${backendUrl}/api/userrole/getUserRole/${registeredUser.uid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { role } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      dispatch(
        setAuthUser({
          user: {
            uid: registeredUser.uid,
            email: registeredUser.email,
            displayName: name,
            photoURL: registeredUser.photoURL,
            role,
          },
          token,
        })
      );

      toast.success("Registered Successfully!");
      navigate("/login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already registered. Please sign in.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
      console.error("Signup Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    googleProvider.setCustomParameters({ prompt: "select_account" });
    try {
      const userCredentials = await signInWithPopup(auth, googleProvider);
      const registeredUser = userCredentials.user;
      const token = await registeredUser.getIdToken();

      const { data } = await axios.get(
        `${backendUrl}/api/userrole/getUserRole/${registeredUser.uid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { role } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      dispatch(
        setAuthUser({
          user: {
            uid: registeredUser.uid,
            email: registeredUser.email,
            displayName: registeredUser.displayName,
            photoURL: registeredUser.photoURL,
            role,
          },
          token,
        })
      );

      toast.success("Signed Up With Google!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Google Sign-Up Failed");
      console.error("Google Signup Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const password = watch("password");
  const input_style =
    "w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200";
  const error_style = "flex items-center gap-1 text-red-400 text-sm mt-1";

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* highlight-start */}
      {/* --- Modern "Glass" Card --- */}
      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-700">
        {/* --- Header --- */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-2">
            <img
              src="https://tse3.mm.bing.net/th?id=OIP.VB187cXwkH66uPWT3X34JQHaHa&pid=Api&P=0&h=180"
              alt="logo"
              className="w-12 h-12 rounded-full object-cover"
            />
            <h1 className="text-3xl text-white font-bold">PG-Finder</h1>
          </Link>
          <h2 className="text-2xl font-bold text-white">Create Your Account</h2>
          <p className="text-gray-400">Join us to find your perfect PG!</p>
        </div>

        {/* --- Form --- */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              className={input_style}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <span className={error_style}>
                <FaExclamationCircle />
                {errors.name.message}
              </span>
            )}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email Address"
              className={input_style}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <span className={error_style}>
                <FaExclamationCircle />
                {errors.email.message}
              </span>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className={input_style}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            {errors.password && (
              <span className={error_style}>
                <FaExclamationCircle />
                {errors.password.message}
              </span>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              className={input_style}
              {...register("confirm", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.confirm && (
              <span className={error_style}>
                <FaExclamationCircle />
                {errors.confirm.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* --- "OR" Separator --- */}
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="flex-shrink mx-4 text-gray-400">OR</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        {/* --- Google Sign Up --- */}
        <button
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gray-700 text-white font-medium flex items-center justify-center gap-3 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200 disabled:opacity-50"
        >
          <FcGoogle size={24} />
          <span>Sign Up with Google</span>
        </button>

        {/* --- Link to Login --- */}
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:text-blue-300 font-medium transition duration-200"
          >
            Sign In
          </Link>
        </p>
      </div>
      {/* highlight-end */}
    </div>
  );
};

export default Signup;
