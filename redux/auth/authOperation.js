import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, storage } from '../../firebase/config';
import { updateUserData } from './authSlice';

const metadata = {
  contentType: 'image/jpeg',
};

const uploadPhoto = async image => {
  const photoRef = ref(storage, 'avatars/' + Date.now() + '.jpg');
  const response = await fetch(image);
  const file = await response.blob();
  const uploadTask = await uploadBytes(photoRef, file, metadata);
  const url = await getDownloadURL(uploadTask.ref);
  console.log('Photo available at', url);
  return url;
};

export const registerUser = createAsyncThunk('auth/registerUser ', async (user, thunkApi) => {
  const { email, login, password, image } = user;
  console.log('operation', image);
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    console.log('response', user);
    const url = await uploadPhoto(image);
    await updateProfile(auth.currentUser, {
      displayName: login,
      photoURL: url,
    });
    return {
      login,
      email: user.email,
      userId: user.uid,
      photoURL: url,
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
