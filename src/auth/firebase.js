import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { clearUser, setUser } from "../features/AuthSlice";

import {
  toastSuccessNotify,
  toastErrorNotify,
  toastWarnNotify,
} from "../helpers/ToastNotify";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const createUser = async (email, password, navigate, displayName) => {
  try {
    let userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    //? kullanıcı profilini güncellemek için kullanılan firebase metodu
    await updateProfile(auth.currentUser, {
      displayName: displayName,
    });
    // SweetAlertsRegister();
    navigate("/");
    console.log(userCredential);
  } catch (error) {
    // SweetAlertsError(error);
    console.log(error);
  }
};

export const userObserver = (setCurrentUser) => {
  //? Kullanıcının signin olup olmadığını takip eden ve kullanıcı değiştiğinde yeni kullanıcıyı response olarak dönen firebase metodu
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const { email, displayName, photoURL } = user;
      setCurrentUser({ email, displayName, photoURL });
      console.log(user);
    } else {
      setCurrentUser(false);
      console.log("user signed out");
    }
  });
};
export const logOut = (navigate, dispatch) => {
  signOut(auth);
  dispatch(clearUser());
  toastWarnNotify("logged out successfully");
  navigate("/login");
};
export const signIn = async (username, email, password, navigate, dispatch) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    dispatch(
      setUser({
        username: username,
        email: email,
        password: password,
      })
    );
    navigate("/home");
    toastSuccessNotify("Login successfully!");
  } catch (error) {
    toastErrorNotify(error.message);
  }
};

export const signUpProvider = (navigate, dispatch) => {
  //? Google ile giriş yapılması için kullanılan firebase metodu
  const provider = new GoogleAuthProvider();
  //? Açılır pencere ile giriş yapılması için kullanılan firebase metodu
  signInWithPopup(auth, provider)
    .then(({ user }) => {
      dispatch(
        setUser({
          displayName: user.displayName,
          email: user.email,
        })
      );
      navigate("/home");
      toastSuccessNotify("Login successfully!!");
    })
    .catch((error) => {
      // Handle Errors here.
      toastErrorNotify(error);
    });
};