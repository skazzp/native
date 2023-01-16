import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../../firebase/config';
import { updateUserData } from './authSlice';

export const registerUser = createAsyncThunk('auth/registerUser ', async (user, thunkApi) => {
  const { email, login, password } = user;
  console.log('operation', login, password);
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    console.log('response', user);
    await updateProfile(auth.currentUser, {
      displayName: login,
      photoURL: 'https://example.com/jane-q-user/profile.jpg',
    });
    return {
      login,
      email: user.email,
      userId: user.uid,
      photoURL: 'https://example.com/jane-q-user/profile.jpg',
    };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
    return thunkApi.rejectWithValue(errorMessage);
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (user, thunkApi) => {
  const { email, password } = user;

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    console.log('Login response', user);

    return {
      login: user.displayName,
      email: user.email,
      userId: user.uid,
      photoURL: user.photoURL,
    };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
    return thunkApi.rejectWithValue(errorMessage);
  }
});

export const logOutUser = createAsyncThunk('auth/logOutUser', async (_, thunkApi) => {
  try {
    signOut(auth);
  } catch (error) {
    return thunkApi.rejectWithValue(error.response.data.message);
  }
});
