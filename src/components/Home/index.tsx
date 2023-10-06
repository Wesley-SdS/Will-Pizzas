import React from "react";
import { Alert } from "react-native";
import { useAuth } from '@hooks/auth'
import brandImg from "@assets/brand.png";
import {
  Container,
  Brand,
  Title,
  ForgotPasswordButton,
  ForgotPasswordLabel,
} from "./styles";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useState } from "react";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../services/firebaseConfig";
import { UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, doc, getDoc } from 'firebase/firestore';


export function Home() {
  const [email, setEmail] = React.useState('')
  const [password, setpassword] = React.useState('')

  const { signIn, isLogging, ForgotPassword } = useAuth();

  // Configure o Firebase com a persistência
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential: UserCredential) => {
        const user = userCredential.user;
        Alert.alert('Conta Criada', 'Sua conta foi criada com sucesso!');
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-email') {
          Alert.alert('Erro ao criar conta', 'E-mail inválido. Verifique o formato do e-mail.');
        } else if (error.code === 'auth/missing-password') {
          Alert.alert('Erro ao criar conta', 'Senha ausente. Por favor, insira uma senha.');
        } else if (error.code === 'auth/invalid-login-credentials') {
          Alert.alert('Erro ao criar conta', 'Credenciais de login inválidas. Verifique seu e-mail e senha.');
        } else if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Erro ao criar conta', 'Este e-mail já está sendo usado em outra conta. Por favor, escolha outro e-mail.');
        } else {
          Alert.alert('Erro ao criar conta', error.message);
        }
      });
  };
  

  function handleForgotPassword(){
    ForgotPassword(email);
  }

  

   const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Login', 'Informe o e-mail e a senha.');
      return;
      
    }

    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
    }
  }


  return (
    <Container>
      <Brand source={brandImg} />
      <Title>Login</Title>
      <Input
        placeholder="E-mail"
        type="secondary"
        autoCorrect={false}
        autoCapitalize="none"
        onChangeText={setEmail}
      />

      <Input
       placeholder="Senha"
       type="secondary"
       secureTextEntry
       onChangeText={setpassword}
      />

      <ForgotPasswordButton onPress={handleForgotPassword}>
        <ForgotPasswordLabel>Esqueci minha Senha</ForgotPasswordLabel>
      </ForgotPasswordButton>

      <Button
        title="Entrar"
        type="secondary"
        onPress={handleSignIn}
        isLoading={isLogging}
      />
      
      <Button
        title="Criar Conta"
        type="secondary"
        onPress={handleCreateAccount}
        isLoading={isLogging}
      />
    </Container>
  );
}
