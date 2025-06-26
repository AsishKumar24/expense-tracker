import { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, UserType } from "@/types";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, firestore } from "@/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
//createContext

{
  /* Context :  Usually, you will pass information from a parent component to a child component via props. 
    But passing props can become verbose and inconvenient if you have to pass them through many components in the middle, or 
    if many components in your app need the same information. Context lets the parent component make some information available to any component 
    in the tree below it—no matter how deep—without passing it explicitly through props. 
    */
}
//createContext is <Auth context type> or null but default value is null
const Authcontext = createContext<AuthContextType | null>(null);
//react.fc :  "This is a React component that uses props!"
//{ children: React.ReactNode } means this component will receive a prop called children that can be any valid React element (JSX, strings, components, etc.).
//When we define a component using React.FC, TypeScript understands that the component will have props including children. However, the function still needs to access children explicitly.
//thats why we destructurise the component
//In React, ReactNode is a type that represents any renderable content. That includes JSX elements, strings, numbers, booleans (even though they don't render), arrays of ReactNodes, and so on.
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType>(null);
  const router = useRouter();
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
        });
        //the name doesnt come from the firestore thatswhy we are using update fn
        updateUserData(firebaseUser.uid);
        router.replace("/(tabs)");
      } else {
        setUser(null);
        router.replace("/(auth)/Welcome");
      }
    });
    return () => unsub(); // clean up the subscription when the component unmounts it will be both for login and logout whenever the state change it will be unSubscribe
  }, []);
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
      //returns error if there is any
    } catch (error: any) {
      let msg = error.message;
      return { success: false, msg };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      //uid
      let response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ); // with this  response we got an uid of user
      //create an document for this user
      //setDoc for documentation and doc fn  for document refernece
      //firestore for database
      //document id is uid
      await setDoc(doc(firestore, "users", response?.user?.uid), {
        name,
        email,
        uid: response?.user?.uid,
      });

      return { success: true };
      //returns error if there is any
    } catch (error: any) {
      let msg = error.message;
      return { success: false, msg };
    }
  };
  //to update user data function this will recieve uid , this fn is not for user data in firestore but it for updating userstate

  const updateUserData = async (uid: string) => {
    try {
      const docRef = doc(firestore, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const userData: UserType = {
          uid: data?.uid,
          email: data?.email || null,
          name: data?.name || null,
          image: data?.image || null,
        };
        setUser({ ...userData });
        console.log("document exist!" + data.name);
        return;
      }
    } catch (error: any) {
      let msg = error.message;
      console.log("error", error);
    }
  };

  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    register,
    updateUserData,
  };
  return (
    <Authcontext.Provider value={contextValue}>{children}</Authcontext.Provider>
  );
};
// (): AuthContextType means "This function returns something of type AuthContextType.
export const useAuth = (): AuthContextType => {
  const context = useContext(Authcontext);
  if (!context) {
    throw new Error("useAuth must be wrapped inside AuthProvider");
  }
  return context;
};
