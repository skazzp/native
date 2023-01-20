import { createSlice } from '@reduxjs/toolkit';

import { refreshUser, loginUser, logOutUser, registerUser } from './authOperation';

const userInitialState = {
  user: {
    login: '',
    email: '',
    userId: '',
    photoURL: '',
  },
  isLoggedIn: false,
  isLoading: false,
  error: '',
};

const pendingHandlerAuth = (state, action) => {
  state.isLoading = true;
  state.error = null;
};

const rejectedHandler = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

const authSlice = createSlice({
  name: 'auth',

  initialState: userInitialState,

  reducers: {
    updateUserData(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
    updateLoginState(state, action) {
      state.isLoggedIn = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(registerUser.pending, pendingHandlerAuth);
    builder.addCase(registerUser.rejected, rejectedHandler);
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.error = null;
      state.isLoading = false;
      const { email, login, photoURL, userId } = action.payload;
      state.user = {
        email,
        login,
        photoURL,
        userId,
      };
      state.isLoggedIn = true;
    });

    builder.addCase(loginUser.pending, pendingHandlerAuth);
    builder.addCase(loginUser.rejected, rejectedHandler);
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.error = null;
      state.isLoading = false;
      const { email, login, photoURL, userId } = action.payload;
      state.user = {
        email,
        login,
        photoURL,
        userId,
      };
      state.isLoggedIn = true;
    });

    builder.addCase(logOutUser.pending, (state, action) => {
      state.error = null;
    });
    builder.addCase(logOutUser.rejected, rejectedHandler);
    builder.addCase(logOutUser.fulfilled, (state, action) => {
      state = { ...userInitialState };
    });
  },
});

export const authReducer = authSlice.reducer;
export const { updateUserData, updateLoginState } = authSlice.actions;
