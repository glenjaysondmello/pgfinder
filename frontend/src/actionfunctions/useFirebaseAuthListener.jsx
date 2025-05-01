import {useEffect} from 'react';
import { onAuthStateChanged, signOut} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useDispatch } from 'react-redux';
import { clearAuthUser } from '../features/auth/authSlice';

const useFirebaseAuthListener = () => {
    const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if(user) {
            try {
                await user.getIdTokenResult(true);
                console.log("Token is Valid");
                
            } catch (error) {
                console.error("Token expired or invalid: ", error);
                await signOut(auth);
                dispatch(clearAuthUser());
            }
        }
    });

    return () => unsubscribe();
  }, [dispatch])

  return null;
}

export default useFirebaseAuthListener;