import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { setRole } from "../features/auth/authSlice";

const useFetchUserRole = () => {
  const { currentUser } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRole = async () => {
      const user = await auth.currentUser;
      if (user && currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser));

          if (userDoc.exists()) {
            const role = userDoc.data().role || "user";
            dispatch(setRole(role));
          } else {
            dispatch(setRole("user document not found"));
          }
        } catch (error) {
          console.error("error fetching role: ", error);
          dispatch(setRole("error"));
        }
      } else {
        dispatch(setRole("not logged in"));
      }
    };

    fetchRole();
  }, [dispatch, currentUser]);
};

export default useFetchUserRole;
