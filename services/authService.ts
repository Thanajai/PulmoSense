import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from '../firebaseConfig';

export const authService = {
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error("Error during sign-in:", error);
      return null;
    }
  },

  signOutUser: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  },
};
