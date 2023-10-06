// auth.tsx

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Alert } from "react-native";
import { initializeApp } from 'firebase/app';
import { sendPasswordResetEmail, getAuth, signInWithEmailAndPassword as signInWithEmailAndPasswordFirebase, signOut as signOutFirebase, UserCredential } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseConfig } from '../services/firebaseConfig'; // Importe o objeto firebaseConfig do seu arquivo
import { firebase } from '@react-native-firebase/auth';


type User = {
  id: string;
  name: string;
  isAdmin: boolean;
}

type AuthContextData = {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  ForgotPassword: (email: string) => Promise<void>;
  isLogging: boolean;
  user: User | null;
}

type AuthProviderProps = {
  children: ReactNode;
}

const USER_COLLECTION = '@gopizza:users';

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLogging, setIsLogging] = useState(false);

  // Inicialize o Firebase com as configurações do seu arquivo
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  async function signIn(email: string, password: string) {
    if (!email || !password) {
      return Alert.alert('Login', 'Informe o e-mail e a senha.');
    }

    setIsLogging(true);

    try {
      const userCredential: UserCredential = await signInWithEmailAndPasswordFirebase(auth, email, password);

      const user = userCredential.user;

      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data() as User;
          userData.id = user.uid;
          await AsyncStorage.setItem(USER_COLLECTION, JSON.stringify(userData));
          setUser(userData);
          console.log(userData);
        }
      }
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        Alert.alert('Login', 'E-mail e/ou senha Inválida.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Login', 'E-mail inválido.');
      } else {
        Alert.alert('Login', `Não foi possível realizar o login: ${error.message}`);
      }
    } finally {
      setIsLogging(false);
    }
  }

  async function loadUserStorageData() {
    setIsLogging(true);

    const storedUser = await AsyncStorage.getItem(USER_COLLECTION);

    if (storedUser) {
      const userData = JSON.parse(storedUser) as User;
      setUser(userData);
   
    }

    setIsLogging(false);
  }

  async function signOut() {
    await signOutFirebase(auth);
    await AsyncStorage.removeItem(USER_COLLECTION);
    setUser(null);
  }

  async function ForgotPassword(email: string) {
    if (!email) {
      return Alert.alert('Redefinir senha', 'Informe o e-mail.');
    }
  
    try {
      const auth = getAuth(); // Get the authentication instance
      await sendPasswordResetEmail(auth, email); // Send the password reset email
  
      Alert.alert('Redefinir senha', 'Enviamos um link no seu e-mail para redefinir a sua senha.');
    } catch (error) {
      Alert.alert('Redefinir senha', 'Não foi possível enviar o e-mail para redefinir a sua senha.');
      console.log(error);
    }
  }


  useEffect(() => {
    loadUserStorageData();
  }, []);

  return (
    <AuthContext.Provider value={{
      signIn,
      signOut,
      ForgotPassword,
      isLogging,
      user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
