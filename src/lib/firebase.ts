import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAerboLllCRptvcn2hT1grWmK8Q0Uv58BQ",
  authDomain: "habbit-otp.firebaseapp.com",
  projectId: "habbit-otp",
  storageBucket: "habbit-otp.firebasestorage.app",
  messagingSenderId: "7122951500",
  appId: "1:7122951500:web:c651d6e27fbcb8d03583e9",
  measurementId: "G-GFX1FLLHV5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Set language to user's browser preference
auth.languageCode = navigator.language;

// Register with email and password
export const registerWithEmail = async (
  email: string, 
  password: string,
  fullName: string
): Promise<{ success: boolean; error?: string; user?: User }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's display name
    await updateProfile(userCredential.user, {
      displayName: fullName
    });
    
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    let errorMessage = 'Failed to create account. Please try again.';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'An account with this email already exists.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address format.';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak. Please use at least 6 characters.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Email/password accounts are not enabled. Please contact support.';
        break;
    }
    
    return { success: false, error: errorMessage };
  }
};

// Sign in with email and password
export const loginWithEmail = async (
  email: string, 
  password: string
): Promise<{ success: boolean; error?: string; user?: User }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    let errorMessage = 'Failed to sign in. Please try again.';
    
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address format.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password. Please try again.';
        break;
      case 'auth/invalid-credential':
        errorMessage = 'Invalid email or password. Please check your credentials.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later.';
        break;
    }
    
    return { success: false, error: errorMessage };
  }
};

// Send password reset email
export const resetPassword = async (
  email: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    let errorMessage = 'Failed to send reset email. Please try again.';
    
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address format.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email.';
        break;
    }
    
    return { success: false, error: errorMessage };
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  await auth.signOut();
};

// Subscribe to auth state changes
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
