import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import useRouter from '../router';
import { refreshUser } from '../redux/auth/authOperation';
import { onAuthStateChanged } from 'firebase/auth';
import { updateLoginState, updateUserData } from '../redux/auth/authSlice';
import { auth } from '../firebase/config';

const Main = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  const routing = useRouter(isLoggedIn);
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        // console.log('logged in', user);
        dispatch(
          updateUserData({
            login: user.displayName,
            email: user.email,
            userId: user.uid,
            photoURL: user.photoURL,
          })
        );
        dispatch(updateLoginState(true));
      } else {
        // console.log('not logged in');
        dispatch(updateLoginState(false));
      }
    });
    // dispatch(refreshUser());
  }, []);

  return <NavigationContainer>{routing}</NavigationContainer>;
};

export default Main;
