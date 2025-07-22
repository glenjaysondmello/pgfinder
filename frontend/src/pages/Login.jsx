import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { auth, googleProvider } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { setAuthUser } from "../features/auth/authSlice";
import { FaExclamationCircle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async ({ email, password }) => {
    setIsLoading(true);
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const loggedUser = userCredentials.user;
      const token = await loggedUser.getIdToken();

      const { data } = await axios.get(
        `/api/userrole/getUserRole/${loggedUser.uid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { role } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      dispatch(setAuthUser({
        user: {
          uid: loggedUser.uid,
          email: loggedUser.email,
          displayName: loggedUser.displayName,
          photoURL: loggedUser.photoURL,
          role,
        },
        token,
      }));

      toast.success("Logged In Successfully!");
      navigate("/");

    } catch (error) {
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        toast.error("Incorrect email or password.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
      console.error("Login Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    googleProvider.setCustomParameters({ prompt: "select_account" });
    try {
      const userCredentials = await signInWithPopup(auth, googleProvider);
      const loggedUser = userCredentials.user;
      const token = await loggedUser.getIdToken();

      const { data } = await axios.get(
        `/api/userrole/getUserRole/${loggedUser.uid}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { role } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      dispatch(setAuthUser({
        user: {
          uid: loggedUser.uid,
          email: loggedUser.email,
          displayName: loggedUser.displayName,
          photoURL: loggedUser.photoURL,
          role,
        },
        token,
      }));
      
      toast.success("Signed In With Google!");
      navigate("/");

    } catch (error) {
      toast.error(error.message || "Google Sign-In Failed");
      console.error("Google Login Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const input_style = "w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200";
  const error_style = "flex items-center gap-1 text-red-400 text-sm mt-1";

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-700">
        
        <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-2">
                 <img
                    src="https://tse3.mm.bing.net/th?id=OIP.VB187cXwkH66uPWT3X34JQHaHa&pid=Api&P=0&h=180"
                    alt="logo"
                    className="w-12 h-12 rounded-full object-cover"
                />
                <h1 className="text-3xl text-white font-bold">PG-Finder</h1>
            </Link>
          <h2 className="text-2xl font-bold text-white">Welcome Back!</h2>
          <p className="text-gray-400">Sign in to continue.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input type="email" placeholder="Email Address" className={input_style}
              {...register("email", {
                required: "Email is required",
                pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format" },
              })}
            />
            {errors.email && <span className={error_style}><FaExclamationCircle/>{errors.email.message}</span>}
          </div>
          <div>
            <input type="password" placeholder="Password" className={input_style}
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <span className={error_style}><FaExclamationCircle/>{errors.password.message}</span>}
          </div>

          <button type="submit" disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
        </div>

        <button onClick={handleGoogleSignIn} disabled={isLoading}
          className="w-full py-3 px-4 bg-gray-700 text-white font-medium flex items-center justify-center gap-3 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition-all duration-200 disabled:opacity-50"
        >
          <FcGoogle size={24} />
          <span>Sign In with Google</span>
        </button>
        
        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition duration-200">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;