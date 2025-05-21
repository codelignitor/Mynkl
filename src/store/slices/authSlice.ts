import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isUserLoggedIn: boolean;
}

const initialState: AuthState = {
  token: null,
  isUserLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isUserLoggedIn = true;
    },
    isUserLoggedIn: (state) => {
      
      state.isUserLoggedIn = true;
    },
     setTokenOnly: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.isUserLoggedIn = false;
    },

  },
});

export const { setToken, logout , isUserLoggedIn , setTokenOnly } = authSlice.actions;
export default authSlice.reducer;
