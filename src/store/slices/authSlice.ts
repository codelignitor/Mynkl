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
    logout: (state) => {
      state.token = null;
      state.isUserLoggedIn = false;
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
