// FIX: Updated Firebase import path from 'firebase/auth' to '@firebase/auth' to resolve module export errors.
// FIX: Add FirebaseError to imports for specific error handling.
import { signInWithPopup, signOut } from "@firebase/auth";
// FIX: Import FirebaseError from the core @firebase/app package to resolve module export error.
import { FirebaseError } from "@firebase/app";
import { auth, provider } from '../firebaseConfig';

export const authService = {
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error("Error during sign-in:", error);
      // FIX: Provide a user-friendly alert for the common 'auth/unauthorized-domain' error.
      // This guides the user to fix their Firebase project configuration.
      if (error instanceof FirebaseError && error.code === 'auth/unauthorized-domain') {
        alert(
          'Authentication Error: This domain is not authorized for Firebase authentication.\n\n' +
          'To fix this, please follow these steps:\n' +
          '1. Go to your Firebase Console (console.firebase.google.com).\n' +
          '2. Navigate to your project.\n' +
          '3. Go to "Authentication" > "Settings" tab > "Authorized domains".\n' +
          '4. Click "Add domain" and enter the current domain: ' + window.location.hostname
        );
      }
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