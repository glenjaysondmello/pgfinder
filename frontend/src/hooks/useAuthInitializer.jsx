import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { setAuthUser, clearAuthUser, setRole } from "../features/auth/authSlice";
import { onAuthStateChanged } from "firebase/auth";

const useAuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const role = userDoc.exists() ? userDoc.data().role : "user";

          dispatch(setAuthUser({
            user: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              role,
            },
            token,
          }));
          dispatch(setRole(role));
        } catch (error) {
          console.error("Error restoring auth:", error);
          dispatch(clearAuthUser());
        }
      } else {
        dispatch(clearAuthUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
};

export default useAuthInitializer;

